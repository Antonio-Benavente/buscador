import { useCallback, useState } from 'react';

export function useRequestState() {
    const [reloadKey, setReloadKey] = useState(0);
    const [result, setResult] = useState(null);

    const retry = useCallback(() => setReloadKey((key) => key + 1), []);

    return { reloadKey, result, setResult, retry };
}
