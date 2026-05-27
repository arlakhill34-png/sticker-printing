# TODO - Initial fixes for first-load errors

## Step 1: Confirm failing network calls ✅
- Identify where `api.getMe()` runs on first load (AuthProvider).
- Confirm exact API_BASE usage.


## Step 2: Make auth bootstrap resilient
- Prevent endless/rapid failures when backend hostname is unreachable.
- Optionally add timeout and backoff for `getMe()`.
- Add clearer console logging for backend connectivity.

## Step 3: Make backend URL configurable
- Support `VITE_API_BASE` (fallback to current onrender URL).
- Ensure Vite exposes it via env.

## Step 4: Re-test first-load behavior
- Open the app fresh in browser.
- Verify no repeated console spam.
- Verify app still loads UI even when backend is offline.

## Step 5: Address font 404 (if needed)
- Check if Google Fonts request is blocked/rewritten.
- Consider bundling fonts locally or removing dependency.

