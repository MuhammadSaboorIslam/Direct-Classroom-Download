# Easy Download for Google Classroom - Direct Download Extension

**Download Google Classroom files instantly without opening preview pages or new tabs!**

## 🚀 What This Extension Does

Stop wasting time clicking through Google Drive preview pages! This Chrome extension adds **one-click download buttons** directly to your Google Classroom assignments, materials, and attachments. Download PowerPoint presentations, PDFs, Word documents, and Excel files instantly from the classroom page itself.

### Perfect for Students & Teachers Who Want To:
- ✅ **Download Google Classroom files directly** without opening Google Drive preview
- ✅ **Save time** - No more clicking "Open in new tab" then "Download" 
- ✅ **Batch download** multiple files quickly from assignments and materials
- ✅ **Work offline faster** - Get your lecture notes, homework, and study materials instantly
- ✅ **Avoid Google Drive redirects** - Direct download links bypass the preview page

## 🎯 Key Features

- **🔽 One-Click Direct Download** - Download button appears on every Google Classroom attachment
- **⚡ Instant Access** - No preview pages, no extra clicks, no waiting
- **📚 All File Types** - Works with PowerPoint (.pptx), PDF, Word (.docx), Excel (.xlsx), and more
- **🎨 Beautiful Design** - Clean, modern button that matches Google Classroom's interface
- **🔄 Auto-Updates** - Detects new attachments as you scroll through your classroom
- **🔒 Privacy First** - Only accesses classroom.google.com, no data collection
- **💯 Free & Open Source** - Completely free to use, modify, and share

## 📥 Installation (2 Minutes)

### Quick Install Steps:

1. **Download this extension**
   - Clone or download this repository to your computer
   
2. **Open Chrome Extensions**
   - Go to `chrome://extensions/` in your browser
   - Or click Menu (⋮) → Extensions → Manage Extensions

3. **Enable Developer Mode**
   - Toggle "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked" button
   - Select the `Easy Download` folder you downloaded

5. **Start Downloading!**
   - Visit any Google Classroom page
   - See download buttons on all attachments
   - Click to download instantly

## 💡 How to Use

1. **Open Google Classroom** - Navigate to any class, assignment, or material page
2. **Find the Download Button** - Look for the circular download icon in the top-right corner of each file attachment
3. **Click to Download** - One click starts the download immediately - no preview page needed!
4. **Save Your File** - File downloads directly to your default download folder

### Works On:
- 📝 Assignment attachments
- 📖 Class materials and resources  
- 📌 Announcements with files
- 📂 All Google Drive files shared in Classroom

## 🔧 Technical Details

### How It Works:
The extension intelligently converts Google Drive "view" links into direct "download" links:

**Before:** `https://drive.google.com/file/d/{FILE_ID}/view`  
**After:** `https://drive.usercontent.google.com/u/0/uc?id={FILE_ID}&export=download`

This bypasses the Google Drive preview page and triggers an immediate download.

### What Gets Modified:
- Finds all Google Classroom attachment containers (`.t2wIBc` elements)
- Extracts Google Drive file IDs from attachment links
- Adds a styled download button to each attachment
- Monitors page for new content (works with infinite scroll)

### Privacy & Permissions:
- ✅ Only accesses `classroom.google.com` pages
- ✅ No data collection or tracking
- ✅ No external server requests
- ✅ All processing happens locally in your browser

## 🌐 Browser Compatibility

- ✅ **Google Chrome** (Recommended)
- ✅ **Microsoft Edge** (Chromium)
- ✅ **Brave Browser**
- ✅ **Opera**
- ✅ Any Chromium-based browser

## 📁 Extension Files

```
Easy Download/
├── manifest.json     # Extension configuration (Manifest V3)
├── content.js        # Core download button injection logic
├── styles.css        # Modern button styling
├── icons/            # Extension icons (16px, 48px, 128px)
└── README.md         # This file
```

## 🆘 Troubleshooting

**Download buttons not appearing?**
- Refresh the Google Classroom page
- Make sure the extension is enabled in `chrome://extensions/`
- Check that you're on a `classroom.google.com` page

**Downloads not starting?**
- Check your browser's download settings
- Ensure pop-ups aren't blocked for classroom.google.com
- Try right-clicking the download button and selecting "Open in new tab"

## 🤝 Contributing

This is an open-source project! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Fork and customize for your needs

## 📄 License

MIT License - Free to use, modify, and distribute

---

## 🔍 Keywords

Google Classroom download, direct download Google Classroom, download classroom files, Google Classroom extension, classroom attachment downloader, skip Google Drive preview, batch download classroom files, Google Classroom Chrome extension, download classroom materials, student productivity tools, teacher tools, classroom file manager, instant download extension, Google Drive direct download, classroom productivity extension
