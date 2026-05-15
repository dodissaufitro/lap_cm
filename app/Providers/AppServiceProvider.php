<?php

namespace App\Providers;

use App\Models\Pengajuan;
use App\Policies\PengajuanPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::policy(Pengajuan::class, PengajuanPolicy::class);

        if ($this->shouldForceHttps()) {
            $this->forceHttpsUrls();
        }
    }

    private function shouldForceHttps(): bool
    {
        if ($this->app->environment('production')) {
            return true;
        }

        $appUrl = config('app.url');

        if (is_string($appUrl) && str_starts_with($appUrl, 'https://')) {
            return true;
        }

        return ! $this->app->runningInConsole() && request()->isSecure();
    }

    private function forceHttpsUrls(): void
    {
        URL::forceScheme('https');

        $appUrl = config('app.url');

        if (is_string($appUrl) && $appUrl !== '') {
            URL::forceRootUrl(preg_replace('#^http://#i', 'https://', rtrim($appUrl, '/')));
        } elseif (! $this->app->runningInConsole()) {
            URL::forceRootUrl('https://'.request()->getHttpHost());
        }

        if (config('session.secure') === null) {
            config(['session.secure' => true]);
        }
    }
}
