#!/bin/sh
# Assembles the single-file game, index.html, from the pieces in src/.
# The order matters: every part shares one closure that body.html opens and tail.js closes.
set -e
cd "$(dirname "$0")"
{
  cat <<'HTML'
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="A pixel-art climbing game: a mermaid, a fairy and a unicorn outsmart a witch across 60 levels to bring back the sunrise.">
<meta name="theme-color" content="#0b1640">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 -0.5 7 7' shape-rendering='crispEdges'%3E%3Cpath fill='%23ff5f8f' d='M1 0h2v1h1V0h2v1h1v2H6v1H5v1H4v1H3V5H2V4H1V3H0V1h1z'/%3E%3C/svg%3E">
HTML
  cat src/head.html
  printf '</head>\n<body>\n'
  cat src/body.html src/sprites.js src/world.js src/play.js src/scenes.js src/party.js src/island.js src/tail.js
  printf '</body>\n</html>\n'
} > index.html
echo "built index.html ($(wc -c < index.html | tr -d ' ') bytes)"
