const home = `<div>Plain text and HTML support is working!<br> {%=testvariable%} <br>{%-"Variables with no XSS protection is working as well as we can print window location here: " + window.location.href%}<br>{% if (true) { %} JavaScript support is working! {% } %}</div>`;

/* Will add JSX-style templating. */

export default home;