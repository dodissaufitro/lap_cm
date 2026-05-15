<?php

namespace App\Http\Middleware;

use App\Support\MenuPermissionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureMenuPermission
{
    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user) {
            abort(403);
        }

        MenuPermissionService::ensureDefaults();

        $routeName = $request->route()?->getName();

        if ($routeName && ! MenuPermissionService::userCanAccessRoute($user, $routeName)) {
            abort(403, 'Anda tidak memiliki akses ke menu ini.');
        }

        return $next($request);
    }
}
