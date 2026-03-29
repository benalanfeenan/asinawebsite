const fs = require('fs');
const path = require('path');

// Simple markdown to HTML converter (no external deps needed)
function markdownToHtml(md) {
  let html = md
    // Headers
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:var(--teal);font-weight:600;">$1</a>')
    // Images
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="width:100%;border-radius:var(--radius);margin:24px 0;" loading="lazy">')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr style="border:none;border-top:1px solid var(--border);margin:32px 0;">')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Single newlines within paragraphs
    .replace(/\n/g, '<br>');

  // Wrap loose list items in <ul>
  html = html.replace(/(<li>.*?<\/li>(\s*<br>)*)+/g, (match) => {
    return '<ul style="margin:16px 0;padding-left:24px;list-style:disc;">' + match.replace(/<br>/g, '') + '</ul>';
  });

  // Wrap in paragraph tags
  html = '<p>' + html + '</p>';

  // Clean up empty paragraphs
  html = html.replace(/<p>\s*<\/p>/g, '');
  html = html.replace(/<p>\s*(<h[1-4]>)/g, '$1');
  html = html.replace(/(<\/h[1-4]>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<ul)/g, '$1');
  html = html.replace(/(<\/ul>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<hr)/g, '$1');
  html = html.replace(/(\/?>)\s*<\/p>/g, '$1');
  html = html.replace(/<p>\s*(<img)/g, '$1');

  return html;
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: content };

  const meta = {};
  match[1].split('\n').forEach(line => {
    const colonIdx = line.indexOf(':');
    if (colonIdx > 0) {
      const key = line.slice(0, colonIdx).trim();
      let value = line.slice(colonIdx + 1).trim();
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      meta[key] = value;
    }
  });

  return { meta, body: match[2].trim() };
}

// Format date for display
function formatDate(dateStr) {
  const d = new Date(dateStr);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

// Format date for sitemap
function formatDateISO(dateStr) {
  const d = new Date(dateStr);
  return d.toISOString().split('T')[0];
}

// Category badge colors
function getCategoryStyle(category) {
  const styles = {
    'NDIS Guide': 'background:var(--teal-10);color:var(--teal-dark);',
    'Tips': 'background:var(--amber-glow);color:#b8860b;',
    'Community Guide': 'background:var(--teal-10);color:var(--teal-dark);',
    'News': 'background:#e8f4fd;color:#1a6fa8;',
    'SIL': 'background:#f0e6ff;color:#6b21a8;',
  };
  return styles[category] || styles['NDIS Guide'];
}

// Read the blog template
const templatePath = path.join(__dirname, 'blog', '_template.html');
if (!fs.existsSync(templatePath)) {
  console.log('No blog template found. Skipping blog build.');
  process.exit(0);
}
const template = fs.readFileSync(templatePath, 'utf8');

// Read the blog index template
const indexTemplatePath = path.join(__dirname, 'blog', '_index-card-template.html');
if (!fs.existsSync(indexTemplatePath)) {
  console.log('No index card template found. Skipping blog build.');
  process.exit(0);
}
const indexCardTemplate = fs.readFileSync(indexTemplatePath, 'utf8');

// Process all markdown posts
const postsDir = path.join(__dirname, 'blog', 'posts');
if (!fs.existsSync(postsDir)) {
  console.log('No posts directory found. Skipping blog build.');
  process.exit(0);
}

const postFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

if (postFiles.length === 0) {
  console.log('No blog posts found. Skipping blog build.');
  process.exit(0);
}

const posts = [];

postFiles.forEach(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf8');
  const { meta, body } = parseFrontmatter(content);
  const slug = file.replace('.md', '');
  const bodyHtml = markdownToHtml(body);

  const post = {
    slug,
    title: meta.title || slug,
    description: meta.description || '',
    date: meta.date || new Date().toISOString().split('T')[0],
    category: meta.category || 'NDIS Guide',
    image: meta.image || '../community-access.webp',
    image_alt: meta.image_alt || meta.title || '',
    keywords: meta.keywords || '',
    bodyHtml,
  };

  // Generate the full HTML page
  let page = template
    .replace(/{{title}}/g, post.title)
    .replace(/{{description}}/g, post.description)
    .replace(/{{keywords}}/g, post.keywords)
    .replace(/{{slug}}/g, post.slug)
    .replace(/{{date}}/g, formatDate(post.date))
    .replace(/{{date_iso}}/g, formatDateISO(post.date))
    .replace(/{{category}}/g, post.category)
    .replace(/{{category_style}}/g, getCategoryStyle(post.category))
    .replace(/{{image}}/g, post.image)
    .replace(/{{image_alt}}/g, post.image_alt)
    .replace(/{{body}}/g, post.bodyHtml);

  // Write the HTML file
  const outputPath = path.join(__dirname, 'blog', `${slug}.html`);
  fs.writeFileSync(outputPath, page);
  console.log(`Built: blog/${slug}.html`);

  posts.push(post);
});

// Sort posts by date (newest first)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

// Generate blog index cards for new posts
const newCards = posts.map(post => {
  return indexCardTemplate
    .replace(/{{slug}}/g, post.slug)
    .replace(/{{title}}/g, post.title)
    .replace(/{{description}}/g, post.description)
    .replace(/{{date_short}}/g, new Date(post.date).toLocaleDateString('en-AU', { month: 'long', year: 'numeric' }))
    .replace(/{{category}}/g, post.category)
    .replace(/{{category_style}}/g, getCategoryStyle(post.category))
    .replace(/{{image}}/g, post.image)
    .replace(/{{image_alt}}/g, post.image_alt);
}).join('\n\n');

// Insert new cards into blog index
const indexPath = path.join(__dirname, 'blog', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Add new cards after the CMS marker comment
const marker = '<!-- CMS_POSTS_START -->';
const markerEnd = '<!-- CMS_POSTS_END -->';

if (indexHtml.includes(marker)) {
  const startIdx = indexHtml.indexOf(marker) + marker.length;
  const endIdx = indexHtml.indexOf(markerEnd);
  indexHtml = indexHtml.slice(0, startIdx) + '\n' + newCards + '\n      ' + indexHtml.slice(endIdx);
  fs.writeFileSync(indexPath, indexHtml);
  console.log('Updated: blog/index.html with new post cards');
}

// Generate RSS feed
function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

const siteUrl = 'https://asinadisability.com.au';
const rssItems = posts.map(post => {
  const postUrl = `${siteUrl}/blog/${post.slug}.html`;
  const pubDate = new Date(post.date).toUTCString();
  return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid>${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.description)}</description>
      <category>${escapeXml(post.category)}</category>
    </item>`;
}).join('\n');

const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Asina Disability Support - Blog</title>
    <link>${siteUrl}/blog/</link>
    <description>NDIS disability support guides, tips, and news from Asina Disability Support in Armidale, NSW.</description>
    <language>en-au</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/feed.xml" rel="self" type="application/rss+xml"/>
${rssItems}
  </channel>
</rss>`;

const feedPath = path.join(__dirname, 'blog', 'feed.xml');
fs.writeFileSync(feedPath, rssFeed);
console.log('Generated: blog/feed.xml (RSS feed)');

console.log(`\nDone! Built ${posts.length} CMS blog post(s).`);
