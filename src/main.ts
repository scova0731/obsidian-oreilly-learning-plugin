import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';

interface OReillyLearningSettings {
    defaultFolder: string;
}

const DEFAULT_SETTINGS: OReillyLearningSettings = {
    defaultFolder: 'oreilly-highlights'
};

export interface OReillyHighlight {
    pk: string;
    quote: string;
    text: string;
    chapter_title: string;
    chapter_url: string;
    cover_url: string;
    epub_identifier: string;
    epub_title: string;  // Changed from title to epub_title
    last_modified_time: string;
    color: string;
    location?: string;
}

export default class OReillyLearningPlugin extends Plugin {
    settings: OReillyLearningSettings;

    async onload() {
        await this.loadSettings();

        // Add ribbon icon
        const ribbonIconEl = this.addRibbonIcon('book-open', 'Import O\'Reilly highlights', () => {
            new ImportModal(this.app, this).open();
        });
        // Remove custom class to use default ribbon icon color

        // Add command
        this.addCommand({
            id: 'import-oreilly-highlights',
            name: 'Import O\'Reilly highlights from JSON',
            callback: () => {
                new ImportModal(this.app, this).open();
            }
        });

        // Add settings tab
        this.addSettingTab(new OReillySettingTab(this.app, this));
    }

    onunload() {}

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async processHighlights(highlights: OReillyHighlight[]) {
        console.log('Processing highlights:', highlights.length);
        console.log('First few highlights:', highlights.slice(0, 3));
        
        const grouped = this.groupHighlightsByBook(highlights);
        console.log('Grouped into books:', grouped.size);
        
        const folder = await this.ensureFolderExists(this.settings.defaultFolder);
        
        let processedCount = 0;
        for (const [bookKey, bookHighlights] of grouped) {
            console.log(`Processing book: ${bookKey}, highlights: ${bookHighlights.length}`);
            const [title, isbn] = bookKey.split('|');
            console.log(`Title: "${title}", ISBN: "${isbn}"`);
            await this.createBookNote(title, isbn, bookHighlights);
            processedCount++;
        }
        
        new Notice(`✅ Imported ${highlights.length} highlights from ${processedCount} books`);
    }

    private groupHighlightsByBook(highlights: OReillyHighlight[]): Map<string, OReillyHighlight[]> {
        const grouped = new Map<string, OReillyHighlight[]>();
        
        for (const highlight of highlights) {
            // Debug log for each highlight
            console.log('Highlight data:', {
                epub_title: highlight.epub_title,
                epub_identifier: highlight.epub_identifier,
                pk: highlight.pk,
                chapter_title: highlight.chapter_title
            });
            
            // Ensure we have a valid title
            const title = highlight.epub_title || 'Untitled Book';
            const bookKey = `${title}|${highlight.epub_identifier}`;
            
            if (!grouped.has(bookKey)) {
                grouped.set(bookKey, []);
                console.log(`Created new book group: ${bookKey}`);
            }
            grouped.get(bookKey)!.push(highlight);
        }
        
        // Log summary
        console.log('Book groups created:');
        for (const [key, highlights] of grouped) {
            console.log(`  ${key}: ${highlights.length} highlights`);
        }
        
        return grouped;
    }

    private async createBookNote(title: string, isbn: string, highlights: OReillyHighlight[]) {
        console.log(`\n=== Sorting highlights for: ${title} ===`);
        console.log('First pk format check:', highlights[0]?.pk);
        
        // Determine if we have location-based PKs or UUID-based PKs
        const hasLocationPK = highlights.some(h => h.pk.includes(':'));
        
        if (hasLocationPK) {
            // Sort by location (extracted from pk)
            highlights.sort((a, b) => {
                const getLocation = (highlight: OReillyHighlight) => {
                    const parts = highlight.pk.split(':');
                    if (parts.length > 1) {
                        const locationStr = parts[1];
                        const numLocation = parseInt(locationStr, 10);
                        if (!isNaN(numLocation)) {
                            return numLocation;
                        }
                        const floatLocation = parseFloat(locationStr);
                        if (!isNaN(floatLocation)) {
                            return floatLocation;
                        }
                    }
                    return 0;
                };
                return getLocation(a) - getLocation(b);
            });
            console.log('Sorted by location from pk');
        } else {
            // For UUID-based PKs, sort by last_modified_time (creation date)
            highlights.sort((a, b) => {
                const dateA = new Date(a.last_modified_time).getTime();
                const dateB = new Date(b.last_modified_time).getTime();
                return dateA - dateB;
            });
            console.log('Sorted by creation date (UUID-based PKs)');
        }
        
        console.log('=== End sorting ===\n');
        
        // Generate content
        const content = this.generateNoteContent(title, isbn, highlights);
        
        // Create file
        const fileName = this.sanitizeFileName(title) + '.md';
        const filePath = `${this.settings.defaultFolder}/${fileName}`;
        
        const file = this.app.vault.getAbstractFileByPath(filePath);
        if (file instanceof TFile) {
            await this.app.vault.modify(file, content);
        } else {
            await this.app.vault.create(filePath, content);
        }
    }

    private generateNoteContent(title: string, isbn: string, highlights: OReillyHighlight[]): string {
        const first = highlights[0];
        const bookUrl = first.chapter_url.split('/ch')[0] || '';
        
        const lines: string[] = [
            `# ${title}`,
            ''
        ];
        
        if (first.cover_url) {
            lines.push(`![Cover](${first.cover_url})`, '');
        }
        
        lines.push(
            `**ISBN:** ${isbn}`,
            `**URL:** [View on O'Reilly](${bookUrl})`,
            '',
            '---',
            '',
            '## Highlights',
            ''
        );
        
        // Process highlights in order, adding chapter headers as needed
        let currentChapter = '';
        for (const highlight of highlights) {
            const chapter = highlight.chapter_title || 'Unknown Chapter';
            
            // Add chapter header if it changed
            if (chapter !== currentChapter) {
                currentChapter = chapter;
                lines.push(`### ${chapter}`, '');
            }
            
                // Add highlight text with link on the same line
                let highlightLine = highlight.quote.trim();
                
                // Add direct link to highlight on the same line
                if (highlight.pk && highlight.chapter_url) {
                    const highlightUrl = `${highlight.chapter_url}#${highlight.pk}`;
                    highlightLine += ` - [link](${highlightUrl})`;
                }
                
                lines.push(highlightLine, '');
                
                if (highlight.text && highlight.text.trim()) {
                    lines.push(`**Note:** ${highlight.text.trim()}`, '');
                }
                
                // Add location
                if (highlight.pk) {
                    const parts = highlight.pk.split(':');
                    if (parts.length > 1) {
                        lines.push(`**Location:** ${parts[1]}`, '');
                    }
                }
                
                lines.push('---', '');
        }
        
        return lines.join('\n');
    }

    private async ensureFolderExists(folderPath: string) {
        const folder = this.app.vault.getAbstractFileByPath(folderPath);
        if (!folder) {
            await this.app.vault.createFolder(folderPath);
        }
    }

    private sanitizeFileName(fileName: string): string {
        if (!fileName || fileName === 'undefined') {
            return 'Untitled Book';
        }
        return fileName.replace(/[<>:"/\\|?*]/g, '').trim();
    }
}

class ImportModal extends Modal {
    plugin: OReillyLearningPlugin;

    constructor(app: App, plugin: OReillyLearningPlugin) {
        super(app);
        this.plugin = plugin;
    }

    onOpen() {
        const { contentEl, modalEl } = this;
        
        // Set modal size
        modalEl.style.width = '600px';
        modalEl.style.maxWidth = '90vw';
        
        contentEl.empty();
        contentEl.createEl('h2', { text: 'Import O\'Reilly Highlights' });
        
        // Instructions
        const instructionsEl = contentEl.createDiv();
        instructionsEl.innerHTML = `
            <p><strong>How to export your highlights:</strong></p>
            <ol>
                <li>Go to <a href="https://learning.oreilly.com">O'Reilly Learning</a> and log in</li>
                <li>Open the browser console (F12 → Console)</li>
                <li>Copy and paste the export script below</li>
                <li>A JSON file will be downloaded automatically</li>
            </ol>
        `;
        
        // Export script
        const scriptContainer = contentEl.createDiv();
        scriptContainer.style.marginTop = '20px';
        
        const scriptLabel = scriptContainer.createEl('p', { 
            text: 'Export script (click to copy):' 
        });
        scriptLabel.style.marginBottom = '5px';
        
        const scriptEl = scriptContainer.createEl('pre', {
            cls: 'oreilly-export-script'
        });
        scriptEl.style.backgroundColor = 'var(--background-secondary)';
        scriptEl.style.padding = '10px';
        scriptEl.style.borderRadius = '4px';
        scriptEl.style.fontSize = '11px';
        scriptEl.style.maxHeight = '120px';
        scriptEl.style.overflow = 'auto';
        scriptEl.style.cursor = 'pointer';
        scriptEl.style.userSelect = 'all';
        scriptEl.style.width = '100%';
        scriptEl.style.boxSizing = 'border-box';
        
        // The minified export script
        const exportScript = `(async()=>{console.log('🚀 Starting export...');let h=[],u='https://learning.oreilly.com/api/v1/annotations/all/?page_size=100',p=0;const d=document.createElement('div');d.style.cssText='position:fixed;top:20px;right:20px;background:#28a745;color:white;padding:20px;border-radius:8px;z-index:10000;font-family:Arial;box-shadow:0 4px 6px rgba(0,0,0,0.1);';d.innerHTML='<h3 style="margin:0 0 10px 0;">Exporting Highlights</h3><div id="export-status">Starting...</div>';document.body.appendChild(d);const s=document.getElementById('export-status');try{while(u){p++;s.textContent=\`Fetching page \${p}... (\${h.length} highlights)\`;const r=await fetch(u),j=await r.json();j.results&&(h=h.concat(j.results));u=j.next;u&&await new Promise(r=>setTimeout(r,100))}s.textContent=\`Processing \${h.length} highlights...\`;const b={};h.forEach(i=>b[i.epub_title]=(b[i.epub_title]||0)+1);const e={count:h.length,results:h,exported_at:new Date().toISOString(),books:Object.keys(b).length},l=new Blob([JSON.stringify(e,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(l);a.download=\`oreilly-highlights-\${new Date().toISOString().split('T')[0]}.json\`;a.click();d.innerHTML=\`<h3 style="margin:0 0 10px 0;">✅ Export Complete!</h3><div>Exported \${h.length} highlights from \${Object.keys(b).length} books</div><div style="margin-top:10px;font-size:14px;">Click "Choose file" below to import</div>\`;setTimeout(()=>d.remove(),10000)}catch(e){console.error('Export failed:',e);d.style.background='#dc3545';d.innerHTML=\`<h3 style="margin:0 0 10px 0;">❌ Export Failed</h3><div>\${e.message}</div>\`;setTimeout(()=>d.remove(),5000)}})()`;
        
        scriptEl.textContent = exportScript;
        
        // Copy on click
        scriptEl.addEventListener('click', () => {
            navigator.clipboard.writeText(exportScript);
            new Notice('Script copied to clipboard!');
            scriptEl.style.backgroundColor = 'var(--background-modifier-success)';
            setTimeout(() => {
                scriptEl.style.backgroundColor = 'var(--background-secondary)';
            }, 1000);
        });
        
        // Divider
        const divider = contentEl.createEl('div');
        divider.style.margin = '30px 0 20px 0';
        divider.style.borderTop = '1px solid var(--background-modifier-border)';
        
        // File input
        new Setting(contentEl)
            .setName('Import JSON file')
            .setDesc('Select the downloaded highlights file')
            .addButton(button => {
                button.setButtonText('Choose file');
                button.setCta();
                
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.style.display = 'none';
                
                button.buttonEl.appendChild(input);
                
                button.onClick(() => input.click());
                
                input.addEventListener('change', async (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0];
                    if (!file) return;
                    
                    try {
                        const text = await file.text();
                        const data = JSON.parse(text);
                        
                        console.log('Imported JSON structure:', {
                            count: data.count,
                            resultsLength: data.results?.length,
                            books: data.books,
                            firstResult: data.results?.[0]
                        });
                        
                        if (data.results && Array.isArray(data.results)) {
                            this.close();
                            await this.plugin.processHighlights(data.results);
                        } else {
                            new Notice('Invalid JSON format');
                            console.error('Invalid JSON structure:', data);
                        }
                    } catch (error) {
                        new Notice('Failed to parse JSON file');
                        console.error('Parse error:', error);
                    }
                });
            });
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }
}

class OReillySettingTab extends PluginSettingTab {
    plugin: OReillyLearningPlugin;

    constructor(app: App, plugin: OReillyLearningPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();
        
        containerEl.createEl('h2', { text: 'O\'Reilly Learning Settings' });
        
        new Setting(containerEl)
            .setName('Highlights folder')
            .setDesc('Where to save imported highlights')
            .addText(text => text
                .setPlaceholder('oreilly-highlights')
                .setValue(this.plugin.settings.defaultFolder)
                .onChange(async (value) => {
                    this.plugin.settings.defaultFolder = value || 'oreilly-highlights';
                    await this.plugin.saveSettings();
                }));
        
        containerEl.createEl('h3', { text: 'Help' });
        
        const helpEl = containerEl.createDiv();
        helpEl.innerHTML = `
            <p>To import your O'Reilly highlights:</p>
            <ol>
                <li>Click the book icon in the sidebar or use the command palette</li>
                <li>Copy the export script and run it on O'Reilly Learning</li>
                <li>Import the downloaded JSON file</li>
            </ol>
            <p style="margin-top: 20px;">
                <a href="https://github.com/scova0731/obsidian-oreilly-learning-plugin">Documentation</a> • 
                <a href="https://github.com/scova0731/obsidian-oreilly-learning-plugin/issues">Report an issue</a>
            </p>
        `;
    }
}