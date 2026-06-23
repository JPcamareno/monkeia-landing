"use client";

import { useEffect } from "react";
import Script from "next/script";
import Clarity from "@microsoft/clarity";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
const VT_ID = "cbc4ac48-79a7-4fe1-a060-237b00e715eb";

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    init_tracer?: () => void;
  }
}

export default function Analytics() {
  useEffect(() => {
    if (CLARITY_ID) Clarity.init(CLARITY_ID);
  }, []);

  return (
    <>
      {FB_PIXEL_ID && (
        <>
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window,document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img height="1" width="1" style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${FB_PIXEL_ID}&ev=PageView&noscript=1`} alt="" />
          </noscript>
        </>
      )}

      <Script id="visitor-tracking" strategy="afterInteractive">
        {`
          (function(){
            window.init_tracer = function(){
              new Tracer({ websiteId: "${VT_ID}", async: true, debug: false });
            };
            var s = document.createElement('script');
            s.src = 'https://app.visitortracking.com/assets/js/tracer.js';
            s.async = true; s.defer = true;
            s.onload = function(){ if (window.init_tracer) window.init_tracer(); };
            document.head.appendChild(s);
          })();
        `}
      </Script>
    </>
  );
}
