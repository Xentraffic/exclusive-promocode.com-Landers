(function () {
    ! function (l) {
        function r(b, a) {
            var h = (65535 & b) + (65535 & a);
            return (b >> 16) + (a >> 16) + (h >> 16) << 16 | 65535 & h
        }

        function p(b, a, h, q, x, g) {
            b = r(r(a, b), r(q, g));
            return r(b << x | b >>> 32 - x, h)
        }

        function g(b, a, h, q, g, k, c) {
            return p(a & h | ~a & q, b, a, g, k, c)
        }

        function k(b, a, h, q, g, k, c) {
            return p(a & q | h & ~q, b, a, g, k, c)
        }

        function m(b, a, h, q, g, k, c) {
            return p(a ^ h ^ q, b, a, g, k, c)
        }

        function n(b, a, h, q, g, k, c) {
            return p(h ^ (a | ~q), b, a, g, k, c)
        }

        function u(b, a) {
            var h, q, l, p;
            b[a >> 5] |= 128 << a % 32;
            b[14 + (a + 64 >>> 9 << 4)] = a;
            var c = 1732584193,
                d = -271733879,
                e = -1732584194,
                f = 271733878;
            for (a = 0; a < b.length; a += 16) d = n(d = n(d = n(d = n(d = m(d = m(d = m(d = m(d = k(d = k(
                                d = k(d = k(d = g(d = g(d = g(d = g(q = d, e = g(l =
                                                    e, f = g(p = f, c = g(
                                                            h = c, d, e, f,
                                                            b[a], 7, -
                                                            680876936), d,
                                                        e, b[a + 1], 12, -
                                                        389564586), c, d, b[
                                                        a + 2], 17,
                                                    606105819), f, c, b[a +
                                                    3], 22, -1044525330), e = g(
                                                    e, f = g(f, c = g(c, d, e,
                                                            f, b[a + 4], 7, -
                                                            176418897), d, e, b[
                                                            a + 5], 12,
                                                        1200080426), c, d, b[a +
                                                        6], 17, -1473231341), f,
                                                c, b[a + 7], 22, -45705983), e =
                                            g(e, f = g(f, c = g(c, d, e, f, b[
                                                        a + 8], 7,
                                                    1770035416), d, e, b[a +
                                                    9], 12, -1958414417), c, d,
                                                b[a + 10], 17, -42063), f, c, b[
                                                a + 11], 22, -1990404162), e =
                                        g(e, f = g(f, c = g(c, d, e, f, b[a +
                                                    12], 7, 1804603682), d, e,
                                                b[a + 13], 12, -40341101), c, d,
                                            b[a + 14], 17, -1502002290), f, c,
                                        b[a + 15], 22, 1236535329), e = k(e, f =
                                        k(f, c = k(c, d, e, f, b[a + 1], 5, -
                                                165796510), d, e, b[a + 6], 9, -
                                            1069501632), c, d, b[a + 11], 14,
                                        643717713), f, c, b[a], 20, -373897302), e =
                                    k(e, f = k(f, c = k(c, d, e, f, b[a + 5], 5, -
                                                701558691), d, e, b[a + 10], 9,
                                            38016083), c, d, b[a + 15], 14, -
                                        660478335), f, c, b[a + 4], 20, -405537848),
                                e = k(e, f = k(f, c = k(c, d, e, f, b[a + 9], 5,
                                        568446438), d, e, b[a + 14], 9, -
                                    1019803690), c, d, b[a + 3], 14, -187363961), f,
                                c, b[a + 8], 20, 1163531501), e = k(e, f = k(f, c =
                                    k(c, d, e, f, b[a + 13], 5, -1444681467), d, e,
                                    b[a + 2], 9, -51403784), c, d, b[a + 7], 14,
                                1735328473), f, c, b[a + 12], 20, -1926607734), e = m(e,
                                f = m(f, c = m(c, d, e, f, b[a + 5], 4, -378558), d, e,
                                    b[a + 8], 11, -2022574463), c, d, b[a + 11], 16,
                                1839030562), f, c, b[a + 14], 23, -35309556), e = m(e, f =
                                m(f, c = m(c, d, e, f, b[a + 1], 4, -1530992060), d, e, b[
                                    a + 4], 11, 1272893353), c, d, b[a + 7], 16, -155497632
                            ), f, c, b[a + 10], 23, -1094730640), e = m(e, f = m(f, c =
                                m(c, d, e, f, b[a + 13], 4, 681279174), d, e, b[a], 11, -
                                358537222), c, d, b[a + 3], 16, -722521979), f, c, b[a + 6], 23,
                            76029189), e = m(e, f = m(f, c = m(c, d, e, f, b[a + 9], 4, -
                                640364487), d, e, b[a + 12], 11, -421815835), c, d, b[a + 15],
                            16, 530742520), f, c, b[a + 2], 23, -995338651), e = n(e, f = n(f, c =
                                n(c, d, e, f, b[a], 6, -198630844), d, e, b[a + 7], 10, 1126891415),
                            c, d, b[a + 14], 15, -1416354905), f, c, b[a + 5], 21, -57434055), e = n(e,
                            f = n(f, c = n(c, d, e, f, b[a + 12], 6, 1700485571), d, e, b[a + 3], 10, -
                                1894986606), c, d, b[a + 10], 15, -1051523), f, c, b[a + 1], 21, -
                        2054922799), e = n(e, f = n(f, c = n(c, d, e, f, b[a + 8], 6, 1873313359), d, e,
                        b[a + 15], 10, -30611744), c, d, b[a + 6], 15, -1560198380), f, c, b[a + 13],
                    21, 1309151649), e = n(e, f = n(f, c = n(c, d, e, f, b[a + 4], 6, -145523070), d, e,
                    b[a + 11], 10, -1120210379), c, d, b[a + 2], 15, 718787259), f, c, b[a + 9], 21, -
                343485551), c = r(c, h), d = r(d, q), e = r(e, l), f = r(f, p);
            return [c, d, e, f]
        }

        function t(b) {
            var a, h = "",
                g = 32 * b.length;
            for (a = 0; a < g; a += 8) h += String.fromCharCode(b[a >> 5] >>> a % 32 & 255);
            return h
        }

        function v(b) {
            var a, h = [];
            h[(b.length >> 2) - 1] = void 0;
            for (a = 0; a < h.length; a += 1) h[a] = 0;
            var g = 8 * b.length;
            for (a = 0; a < g; a += 8) h[a >> 5] |= (255 & b.charCodeAt(a / 8)) << a % 32;
            return h
        }

        function y(b) {
            var a, h = "";
            for (a = 0; a < b.length; a += 1) {
                var g = b.charCodeAt(a);
                h += "0123456789abcdef".charAt(g >>> 4 & 15) + "0123456789abcdef".charAt(15 & g)
            }
            return h
        }

        function z(b) {
            b = unescape(encodeURIComponent(b));
            return t(u(v(b), 8 * b.length))
        }

        function A(b, a) {
            b = unescape(encodeURIComponent(b));
            a = unescape(encodeURIComponent(a));
            var h, g = v(b),
                k = [],
                l = [];
            k[15] = l[15] = void 0;
            16 < g.length && (g = u(g, 8 * b.length));
            for (b = 0; 16 > b; b += 1) k[b] = 909522486 ^ g[b], l[b] = 1549556828 ^ g[b];
            return h = u(k.concat(v(a)), 512 + 8 * a.length), t(u(l.concat(h), 640))
        }

        function w(b, a, g) {
            return a ? g ? A(a, b) : y(A(a, b)) : g ? z(b) : y(z(b))
        }
        "function" == typeof define && define.amd ? define(function () {
            return w
        }) : "object" == typeof module && module.exports ? module.exports = w : l.md5 = w
    }(this);
    var l = (new URLSearchParams(window.location.search)).get("lptoken");
    if (l) {
        var t = l.substr(0, 2) + l.substr(4, 2) + l.substr(8, 2) + l.substr(12, 2) + l.substr(16, 2);
        l = l.substr(2, 2) + l.substr(6, 2) + l.substr(10, 2) + l.substr(14, 2) + l.substr(18, 2);
        var p = md5("hyezao8zhjmzzqajjuiqhdqshtgaajx7w4mp07ukq710x9yk" + t + navigator.userAgent);
        p = p.substr(0, 2) + p.substr(5, 2) + p.substr(12, 2) + p.substr(19, 2) + p.substr(26, 2);
        if (Date.now() / 1E3 > Number(t) || p !== l) window && window.stop() || stop()
    } else window && window.stop() || stop()
})();