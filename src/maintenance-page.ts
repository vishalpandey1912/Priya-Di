/**
 * Maintenance mode HTML. Served to every request while SITE_HALTED is active.
 * To disable: remove the intercept block at the top of middleware.ts.
 */
export const MAINTENANCE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow">
<title>Desi Educators</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Karla:wght@300;400;500&display=swap" rel="stylesheet">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { min-height: 100vh; }
body {
    font-family: 'Karla', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #fafaf7;
    color: #1a1a1a;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    line-height: 1.6;
}
.wrap { max-width: 520px; text-align: center; }
.mark {
    display: inline-block;
    width: 10px; height: 10px;
    background: #c41e1e;
    border-radius: 50%;
    margin-bottom: 32px;
}
h1 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 42px;
    font-weight: 500;
    line-height: 1.15;
    letter-spacing: -0.5px;
    margin-bottom: 18px;
}
p {
    font-size: 16px;
    color: #4b5563;
    margin-bottom: 12px;
    max-width: 440px;
    margin-left: auto;
    margin-right: auto;
}
.divider {
    width: 40px; height: 1px;
    background: #d1d5db;
    margin: 32px auto;
}
.contact { font-size: 13px; color: #6b7280; letter-spacing: 0.3px; }
.contact a {
    color: #c41e1e;
    text-decoration: none;
    border-bottom: 1px solid rgba(196,30,30,0.3);
    padding-bottom: 1px;
}
.contact a:hover { border-bottom-color: #c41e1e; }
@media (max-width: 480px) { h1 { font-size: 32px; } p { font-size: 15px; } }
</style>
</head>
<body>
<div class="wrap">
    <span class="mark"></span>
    <h1>Desi Educators is offline.</h1>
    <p>The platform is temporarily unavailable while we make updates.</p>
    <p>Back soon.</p>
    <div class="divider"></div>
    <div class="contact">
        For enquiries: <a href="mailto:desieducators@outlook.com">desieducators@outlook.com</a>
    </div>
</div>
</body>
</html>`;
