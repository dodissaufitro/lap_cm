<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <script>
            (function () {
                const appearance = localStorage.getItem('appearance') || 'dark';
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                const isDark = appearance === 'dark' || (appearance === 'system' && prefersDark);
                if (isDark) {
                    document.documentElement.classList.add('dark');
                }
            })();
        </script>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>

        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600|cormorant-garamond:400,500,600,700|source-serif-4:400,500,600" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased min-h-dvh">
        @inertia
    </body>
</html>
