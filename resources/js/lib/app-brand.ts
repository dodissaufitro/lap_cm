import { usePage } from '@inertiajs/react';

import { type SharedData } from '@/types';

/** Default logo path (served from `public/images/`). */
export const APP_LOGO_URL = '/images/logo_tch.png';

export const APP_TITLE = 'Tanah Datar Creatif HUB';

export const APP_SHORT_NAME = 'TCH';

export const APP_TAGLINE = 'Smart Enterprise Platform';

export function useAppLogoUrl(): string {
    const { appLogoUrl } = usePage<SharedData>().props;

    return typeof appLogoUrl === 'string' && appLogoUrl.length > 0 ? appLogoUrl : APP_LOGO_URL;
}
