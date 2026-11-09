import { useEffect, useRef } from 'react';
import { useRequestState } from './useRequest.js';
import { logError } from '../utils/log.js';

export function useTmdb(fetcher, deps) {
    const { reloadKey, result, setResult, retry } = useRequestState();

    const fetcherRef = useRef(fetcher);

    useEffect(() => {
        fetcherRef.current = fetcher;
    });

    const requestKey = `${deps.join('|')}:${reloadKey}`;
    const isCurrent = result?.key === requestKey;

    useEffect(() => {
        const controller = new AbortController();
        let active = true;

        (async () => {
            try {
                const payload = await fetcherRef.current(controller.signal);

                if (!active) return;

                setResult({ key: requestKey, ...payload, error: null });
            } catch (err) {
                if (!active || controller.signal.aborted) return;

                logError(err, 'useTmdb');
                setResult({ key: requestKey, error: err });
            }
        })();

        return () => {
            active = false;
            controller.abort();
        };

    }, [requestKey, setResult]);

    return {
        ...(isCurrent ? result : {}),
        error: isCurrent ? result.error : null,
        loading: !isCurrent,
        retry,
    };
}
