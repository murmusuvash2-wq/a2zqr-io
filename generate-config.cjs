const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf-8');
const match = indexHtml.match(/const TOOLS_DATABASE = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find TOOLS_DATABASE');
  process.exit(1);
}

const toolsDatabase = eval(match[1]);

const config = {};

toolsDatabase.forEach(tool => {
  // e.g. path is "/how-to-create-mathematical-fibonacci-spiral-qr-code"
  // so slug is "how-to-create-mathematical-fibonacci-spiral-qr-code"
  const slug = tool.path.replace(/^\//, '');
  
  let short = tool.name.replace(/ QR.*/, '');

  config[slug] = {
    name: tool.name,
    shortName: short,
    cat: tool.cat,
    metaTitle: `Free ${short} QR Code | EzQR.io`,
    metaDesc: `Create custom ${short} QR code easily. No limits, free to use, and high quality forever.`,
    h1Title: `${short} QR Code`,
    badges: ["⚡ Fast Render", "🛡️ Privacy Secure", "🎯 No Limits"],
    specs: {
      "Output Formats": "PNG Image",
      "Data Safety": "Locally Generated, Zero Server Storage",
      "Usage Cost": "100% Free"
    },
    fields: [], // populated below
    howToUse: `1. <strong>Enter Details:</strong> Fill out the required information in the form above.<br>2. <strong>Style It:</strong> Select the design pattern and theme that suits your brand.<br>3. <strong>Download:</strong> See the preview update instantly and click download to get your QR code.`,
    howItWorks: `Our system works entirely in your browser window. No personal data or form inputs are ever sent to our servers. This ensures your information is fully private and secure at all times.`,
    faqs: [
      { q: `Will my generated ${short} ever expire?`, a: "No, all static QR codes created with EzQR are permanent. The data is hard-coded into the pattern itself, so it never expires." },
      { q: `Is it really free? Are there scan limits?`, a: "Yes, it is 100% free with absolutely no scan limits or caps." },
      { q: `Is my data kept private?`, a: "Absolutely. Everything is processed on your local device." },
    ],
    related: [
      { name: "WiFi Network", path: "/wifi-network-access-qr" },
      { name: "Digital vCard", path: "/digital-vcard-qr" }
    ]
  };
  
  // Mapping logic for different tool types
  let tn = tool.name.toLowerCase();
  let tcat = tool.cat.toLowerCase();
  let matchStr = tn + " " + tcat;

  if (matchStr.includes('wifi') || matchStr.includes('network')) {
    config[slug].fields = [
      { id: "in-wifi-ssid", label: "Network Name (SSID)", type: "text", placeholder: "e.g. HomeNetwork", guard: "wifi" },
      { id: "in-wifi-pass", label: "Password", type: "text", placeholder: "e.g. secret123", guard: "wifi" }
    ];
  } else if (matchStr.includes('upi') || matchStr.includes('payment') || matchStr.includes('invoice') || matchStr.includes('bank')) {
    config[slug].fields = [
      { id: "in-upi-vpa", label: "UPI ID / VPA", type: "text", placeholder: "e.g. merchant@upi", guard: "upi" },
      { id: "in-upi-name", label: "Payee Name", type: "text", placeholder: "e.g. Shop Name", guard: "upi" },
      { id: "in-upi-amt", label: "Amount (₹)", type: "number", placeholder: "e.g. 500", guard: "upi" }
    ];
  } else if (matchStr.includes('crypto') || matchStr.includes('sol') || matchStr.includes('bnb') || matchStr.includes('usdt') || matchStr.includes('wallet')) {
    config[slug].fields = [
      { id: "in-crypto-addr", label: "Wallet Address", type: "text", placeholder: "Paste public address here...", guard: "crypto" },
      { id: "in-crypto-amt", label: "Transfer Amount (Optional)", type: "number", placeholder: "e.g. 1.5", guard: "crypto" }
    ];
  } else if (matchStr.includes('map') || matchStr.includes('address') || matchStr.includes('geo') || matchStr.includes('location')) {
    config[slug].fields = [
      { id: "in-map-lat", label: "Latitude / Search Query", type: "text", placeholder: "e.g. 40.7128 or 'Times Square'", guard: "map" },
      { id: "in-map-lng", label: "Longitude (Optional)", type: "text", placeholder: "e.g. -74.0060", guard: "map" }
    ];
  } else if (matchStr.includes('vcard') || matchStr.includes('contact') || matchStr.includes('agent') || matchStr.includes('profile')) {
    config[slug].fields = [
      { id: "in-contact-name", label: "Full Name", type: "text", placeholder: "e.g. John Doe", guard: "contact" },
      { id: "in-contact-phone", label: "Phone Number", type: "tel", placeholder: "e.g. +1 234 567 8900", guard: "contact" },
      { id: "in-contact-email", label: "Email Address", type: "email", placeholder: "e.g. john@example.com", guard: "contact" }
    ];
  } else if (matchStr.includes('whatsapp') || matchStr.includes('sms') || matchStr.includes('telegram') || matchStr.includes('msg') || matchStr.includes('chat')) {
    config[slug].fields = [
      { id: "in-msg-phone", label: "Phone Number (with Country Code)", type: "tel", placeholder: "e.g. +919876543210", guard: "msg" },
      { id: "in-msg-text", label: "Pre-filled Message", type: "text", placeholder: "e.g. Hello!", guard: "msg" }
    ];
  } else if (matchStr.includes('password') || matchStr.includes('message') || matchStr.includes('notes') || matchStr.includes('formula') || matchStr.includes('text')) {
    config[slug].fields = [
      { id: "in-text-data", label: "Content / Message", type: "text", placeholder: "Enter your text payload here...", guard: "text" }
    ];
  } else {
    // Default to URL
    config[slug].fields = [
      { id: "target-url", label: "Target Destination URL / Link", type: "url", placeholder: "https://example.com/your-link", guard: "url" }
    ];
  }
});

fs.writeFileSync('tools-config.cjs', 'module.exports = ' + JSON.stringify(config, null, 2) + ';');
console.log('Successfully generated tools-config.cjs with ' + Object.keys(config).length + ' tools.');
