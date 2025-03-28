function createStopRedirectHandler() {
    return function stopRedirect(proxyRes, req, res , options) {
        // console.log(proxyRes)

        //リダイレクトある場合、リダイレクトを止める
      const location = proxyRes.headers["location"];
      if (location) {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Set-Cookie": proxyRes.headers["set-cookie"]
        });
        res.end(JSON.stringify({ redirectUrl: location }));
        proxyRes.destroy(); // optional
      }
    };
  }
  
  export default {
    "/api": {
      target: "https://api.itandibb.com",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ""),
      configure(proxy, options) {
        proxy.on("proxyRes", createStopRedirectHandler());
      }
    },
  
    "/itandi": {
      target: "https://itandi-accounts.com",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/itandi/, ""),
      configure(proxy, options) {
        proxy.on("proxyReq", (proxyReq, req, res) => {
            //ログイン画面をリクエストを送信する時Cookieを削除する
          if (req.url.includes('/login?client_id=itandi_bb&redirect_uri=https%3A%2F%2Fitandibb.com%2Fitandi_accounts_callback&response_type=code')) {
            proxyReq.removeHeader("cookie");
          }
          //Originを削除する(ログインAPIをリクエストを送信する時に必要)
          if (req.headers.origin) {
            proxyReq.removeHeader("origin");
          }
        });

        proxy.on("proxyRes", createStopRedirectHandler());
      }
    },

    "/itandibb": {
      target: "https://itandibb.com",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/itandibb/, ""),
      configure(proxy, options) {
        // proxy.on("proxyRes", createStopRedirectHandler());
      }
    },
  };