const fs = require('fs');
const path = require('path');
const config = require('./tools-config.cjs');

const templateContent = fs.readFileSync('./template.html', 'utf8');

const outputDir = './tools';
if (!fs.existsSync(outputDir)){
    fs.mkdirSync(outputDir, { recursive: true });
}

console.log("🚀 Programmatic SEO Aggressive Engine Execution Started...");

Object.keys(config).forEach(slugKey => {
    const tool = config[slugKey];
    let html = templateContent;

    // 1. Structural Metadata Interpolation
    html = html.replace(/{{TOOL_META_TITLE}}/g, tool.metaTitle);
    html = html.replace(/{{TOOL_META_DESC}}/g, tool.metaDesc);
    html = html.replace(/{{TOOL_H1_NAME}}/g, tool.h1Title);
    html = html.replace(/{{TOOL_SHORT_NAME}}/g, tool.shortName);

    // 2. Neon Badges Injection Loop
    let badgesHtml = tool.badges.map(b => `<span class="badge-node">${b}</span>`).join('');
    html = html.replace(/{{TOOL_BADGES}}/g, badgesHtml);

    // 3. Dynamic Form Fields Parser
    let fieldsHtml = tool.fields.map(f => {
        return `<div><label class="flabel">${f.label}</label><input class="fi qi" type="${f.type}" id="${f.id}" placeholder="${f.placeholder}" data-guard="${f.guard}"></div>`;
    }).join('');
    html = html.replace(/{{DYNAMIC_FORM_FIELDS}}/g, fieldsHtml);

    // 4. Specifications Tables Matrix Builder
    let specsHtml = Object.keys(tool.specs).map(key => {
        return `<tr><td>${key}</td><td>${tool.specs[key]}</td></tr>`;
    }).join('');
    html = html.replace(/{{TOOL_SPECS_TABLE}}/g, specsHtml);

    // 5. Documentation & Long-Tail Body Content Injections
    html = html.replace(/{{TOOL_HOW_TO_USE}}/g, tool.howToUse);
    html = html.replace(/{{TOOL_HOW_IT_WORKS}}/g, tool.howItWorks);

    // 6. Q&A FAQ Template Blocks Render
    let faqHtml = tool.faqs.map(f => {
        return `<div class="faq-node"><div class="faq-q">Q: ${f.q}</div><div class="faq-a">A: ${f.a}</div></div>`;
    }).join('');
    html = html.replace(/{{TOOL_FAQ_BLOCK}}/g, faqHtml);

    // 7. Context Cross-Linking Pills Generator
    let relatedHtml = tool.related.map(r => {
        return `<a class="pill-route" href="/tools${r.path}/">${r.name}</a>`;
    }).join('');
    html = html.replace(/{{TOOL_RELATED_PILLS}}/g, relatedHtml);

    // 8. Google Rich Snippet JSON-LD Integration
    let schemaObj = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ezqr.io" },
            { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://ezqr.io/#directory" },
            { "@type": "ListItem", "position": 3, "name": tool.shortName }
          ]
        },
        {
          "@type": "FAQPage",
          "mainEntity": tool.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        }
      ]
    };
    let schemaScript = `<script type="application/ld+json">${JSON.stringify(schemaObj)}<\/script>`;
    html = html.replace(/{{GOOGLE_JSON_LD_SCHEMA}}/g, schemaScript);

    // 9. Physical Directory Structural Folder Dump
    const toolFolder = `./tools/${slugKey}`;
    if (!fs.existsSync(toolFolder)){
        fs.mkdirSync(toolFolder, { recursive: true });
    }
    
    fs.writeFileSync(`${toolFolder}/index.html`, html, 'utf8');
});

console.log("🎯 Pure Programmatic Framework Compilation Complete! 100% Locked.");
