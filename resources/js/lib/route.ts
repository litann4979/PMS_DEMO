import { route as ziggyRoute } from 'ziggy-js';
import { Ziggy } from '../ziggy';

export function route(name?: string, params?: any, absolute?: boolean): any {
    const result = ziggyRoute(name as any, params, absolute ?? false, Ziggy as any);
    return typeof result === 'string' ? result : result;
}
