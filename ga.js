/**
 * Google Analytics 4 (GA4) Engagement Tracking for QIBMAUZ TECHNOLOGY
 * Measurement ID: G-C06ET6P7PN (NEXT_PUBLIC_GA_ID / VITE_GA_ID)
 */
(function () {
  var GA_ID = 'G-C06ET6P7PN';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function trackEvent(eventName, params) {
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  // Expose helper for programmatic sign_up or generate_lead tracking
  window.qibmauzAnalytics = {
    measurementId: GA_ID,
    trackSignUp: function (method, appName) {
      trackEvent('sign_up', {
        method: method || 'web',
        app_name: appName || 'QIBMAUZ Website'
      });
    },
    trackGenerateLead: function (leadSource, destinationUrl, label) {
      trackEvent('generate_lead', {
        lead_source: leadSource,
        link_url: destinationUrl,
        link_text: label
      });
    }
  };

  document.addEventListener('click', function (e) {
    var link = e.target.closest ? e.target.closest('a') : null;
    if (!link) return;

    var href = link.getAttribute('href') || '';
    if (!href) return;

    var label = (link.getAttribute('aria-label') || link.textContent || '').trim();

    // 1. Outbound clicks to QIBMAUZ product subdomains
    if (/^https?:\/\/([a-z0-9-]+\.)?qibmauz\.com/i.test(href) && !/^https?:\/\/(www\.)?qibmauz\.com(\/|$)/i.test(href)) {
      var subdomainMatch = href.match(/^https?:\/\/([a-z0-9-]+)\.qibmauz\.com/i);
      var productSlug = subdomainMatch ? subdomainMatch[1] : 'product';

      trackEvent('generate_lead', {
        event_category: 'product_navigation',
        lead_type: 'product_subdomain',
        product_name: productSlug,
        link_url: href,
        link_text: label
      });

      trackEvent('select_content', {
        content_type: 'web_application',
        item_id: productSlug,
        link_url: href
      });
      return;
    }

    // 2. Outbound clicks to Google Play store listings
    if (href.indexOf('play.google.com/store/apps') !== -1) {
      trackEvent('generate_lead', {
        event_category: 'android_app_download',
        lead_type: 'google_play_store',
        link_url: href,
        link_text: label
      });
      return;
    }

    // 3. WhatsApp or Email contact leads
    if (href.indexOf('wa.me/') !== -1 || href.indexOf('api.whatsapp.com') !== -1) {
      trackEvent('generate_lead', {
        event_category: 'contact',
        lead_type: 'whatsapp',
        link_url: href,
        link_text: label
      });
      return;
    }

    if (href.indexOf('mailto:') === 0) {
      trackEvent('generate_lead', {
        event_category: 'contact',
        lead_type: 'email',
        link_url: href,
        link_text: label
      });
      return;
    }

    // 4. Explicit data-ga-event attributes (including sign_up if triggered)
    var customEvent = link.getAttribute('data-ga-event');
    if (customEvent) {
      trackEvent(customEvent, {
        link_url: href,
        link_text: label
      });
    }
  });
})();
