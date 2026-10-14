import { readdirSync, mkdirSync, cpSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve, join } from 'node:path';
const root = process.cwd();
const dist = resolve(root, 'dist');
if (dist !== join(root, 'dist')) throw new Error('Invalid output directory');
rmSync(dist, {recursive:true, force:true});
mkdirSync(dist, {recursive:true});
for (const entry of readdirSync(root, {withFileTypes:true})) {
  if (['assets', 'reference', 'vendor'].includes(entry.name) || /\.(html|css|js|svg)$/.test(entry.name) || ['_headers', '_redirects', 'robots.txt', 'sitemap.xml'].includes(entry.name)) {
    cpSync(join(root,entry.name), join(dist,entry.name), {recursive:true});
  }
}
const pages = readdirSync(dist).filter(p=>p.endsWith('.html'));
const origin = 'https://guomie-tech-blog.pages.dev';
for (const p of pages) {
  const f=join(dist,p);
  const html=readFileSync(f,'utf8');
  if (!html.includes('<html') || !html.includes('</html>')) throw new Error('Invalid HTML: '+p);
}
writeFileSync(join(dist,'sitemap.xml'), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+pages.map(p=>'<url><loc>'+origin+(p==='index.html'?'/':'/'+p)+'</loc></url>').join('')+'</urlset>');
console.log('Built '+pages.length+' portfolio pages and all local assets to dist.');
