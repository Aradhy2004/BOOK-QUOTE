class BookQuoteShorts {
    constructor() {
        this.quotes = [
            {
                id: 1,
                text: "It is our choices, Harry, that show what we truly are, far more than our abilities.",
                bookTitle: "Harry Potter and the Chamber of Secrets",
                author: "J.K. Rowling"
            },
            {
                id: 2,
                text: "The only way out is through.",
                bookTitle: "A Thousand Acres", 
                author: "Jane Smiley"
            },
            {
                id: 3,
                text: "So we beat on, boats against the current, borne back ceaselessly into the past.",
                bookTitle: "The Great Gatsby",
                author: "F. Scott Fitzgerald"
            },
            {
                id: 4, 
                text: "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
                bookTitle: "Pride and Prejudice",
                author: "Jane Austen"
            },
            {
                id: 5,
                text: "It was a pleasure to burn.",
                bookTitle: "Fahrenheit 451",
                author: "Ray Bradbury"
            },
            {
                id: 6,
                text: "All happy families are alike; each unhappy family is unhappy in its own way.",
                bookTitle: "Anna Karenina",
                author: "Leo Tolstoy"
            },
            {
                id: 7,
                text: "It is a tale told by an idiot, full of sound and fury, signifying nothing.",
                bookTitle: "Macbeth",
                author: "William Shakespeare"
            },
            {
                id: 8,
                text: "I am no bird; and no net ensnares me: I am a free human being with an independent will.",
                bookTitle: "Jane Eyre",
                author: "Charlotte Brontë"
            },
            {
                id: 9,
                text: "The man in black fled across the desert, and the gunslinger followed.",
                bookTitle: "The Gunslinger",
                author: "Stephen King"
            },
            {
                id: 10,
                text: "In a hole in the ground there lived a hobbit.",
                bookTitle: "The Hobbit",
                author: "J.R.R. Tolkien"
            },
            {
                id: 11,
                text: "It is not down in any map; true places never are.",
                bookTitle: "Moby-Dick",
                author: "Herman Melville"
            },
            {
                id: 12,
                text: "There is no greater agony than bearing an untold story inside you.",
                bookTitle: "I Know Why the Caged Bird Sings",
                author: "Maya Angelou"
            }
        ];
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.likedQuotes = new Set();
        this.isLikedView = false;
        
        this.init();
    }
    
    init() {
        this.loadLikedQuotes();
        this.setupEventListeners();
        this.showQuote(this.currentIndex);
        this.startAutoPlay();
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.next-btn').addEventListener('click', () => this.nextQuote());
        document.querySelector('.prev-btn').addEventListener('click', () => this.prevQuote());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextQuote();
            if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prevQuote();
        });
        
        // Touch/swipe support
        this.setupSwipe();
        
        // Like button
        document.querySelector('.like-btn').addEventListener('click', (e) => this.toggleLike(e));
        
        // Share button
        document.querySelector('.share-btn').addEventListener('click', (e) => this.shareQuote(e));
        
        // Liked quotes button - toggle view
        document.querySelector('.liked-quotes-btn').addEventListener('click', () => this.toggleLikedView());
        
        // Wheel scroll (like Instagram)
        document.addEventListener('wheel', (e) => {
            if (e.deltaY > 0) {
                this.nextQuote();
            } else {
                this.prevQuote();
            }
        });
    }
    
    setupSwipe() {
        let startY = 0;
        const container = document.querySelector('.app-container');
        
        container.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
        });
        
        container.addEventListener('touchend', (e) => {
            const endY = e.changedTouches[0].clientY;
            const diff = startY - endY;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.nextQuote(); // Swipe up
                } else {
                    this.prevQuote(); // Swipe down
                }
            }
        });
    }
    
    showQuote(index) {
        if (this.isTransitioning) return;
        
        this.isTransitioning = true;
        let quote;
        
        if (this.isLikedView) {
            const likedQuotesArray = this.getLikedQuotesArray();
            if (likedQuotesArray.length === 0) return;
            quote = likedQuotesArray[index];
        } else {
            quote = this.quotes[index];
        }
        
        const card = document.querySelector('.quote-card');
        
        // Slide out animation
        card.style.transform = 'translateY(-100px)';
        card.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            document.querySelector('.quote-text').textContent = `"${quote.text}"`;
            document.querySelector('.book-title').textContent = quote.bookTitle;
            document.querySelector('.author').textContent = `— ${quote.author}`;
            
            // Update like button state
            const likeBtn = document.querySelector('.like-btn');
            if (this.likedQuotes.has(quote.id)) {
                likeBtn.classList.add('liked');
            } else {
                likeBtn.classList.remove('liked');
            }
            
            // Slide in animation
            card.style.transform = 'translateY(0)';
            card.style.opacity = '1';
            
            this.currentIndex = index;
            this.updateProgress();
            this.isTransitioning = false;
        }, 300);
    }
    
    nextQuote() {
        let nextIndex;
        if (this.isLikedView) {
            const likedQuotesArray = this.getLikedQuotesArray();
            if (likedQuotesArray.length === 0) return;
            nextIndex = (this.currentIndex + 1) % likedQuotesArray.length;
        } else {
            nextIndex = (this.currentIndex + 1) % this.quotes.length;
        }
        this.showQuote(nextIndex);
        this.resetAutoPlay();
    }
    
    prevQuote() {
        let prevIndex;
        if (this.isLikedView) {
            const likedQuotesArray = this.getLikedQuotesArray();
            if (likedQuotesArray.length === 0) return;
            prevIndex = this.currentIndex === 0 ? likedQuotesArray.length - 1 : this.currentIndex - 1;
        } else {
            prevIndex = this.currentIndex === 0 ? this.quotes.length - 1 : this.currentIndex - 1;
        }
        this.showQuote(prevIndex);
        this.resetAutoPlay();
    }
    
    updateProgress() {
        document.querySelector('.progress').style.width = '0%';
        setTimeout(() => {
            document.querySelector('.progress').style.width = '100%';
        }, 50);
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextQuote();
        }, 8000);
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
    
    toggleLike(event) {
        const currentQuote = this.isLikedView ? 
            this.getLikedQuotesArray()[this.currentIndex] : 
            this.quotes[this.currentIndex];
        
        if (this.likedQuotes.has(currentQuote.id)) {
            this.likedQuotes.delete(currentQuote.id);
            event.target.classList.remove('liked');
        } else {
            this.likedQuotes.add(currentQuote.id);
            event.target.classList.add('liked');
            
            // Animation for like
            event.target.style.transform = 'scale(1.3)';
            setTimeout(() => {
                event.target.style.transform = 'scale(1)';
            }, 300);
        }
        
        this.saveLikedQuotes();
        this.updateLikedCount();
    }
    
    getLikedQuotesArray() {
        return this.quotes.filter(quote => this.likedQuotes.has(quote.id));
    }
    
    toggleLikedView() {
        if (this.isLikedView) {
            this.showAllQuotes();
        } else {
            const likedQuotesArray = this.getLikedQuotesArray();
            if (likedQuotesArray.length === 0) {
                this.showNotification('No liked quotes yet! ❤️');
                return;
            }
            this.showLikedQuotes();
        }
    }
    
    showLikedQuotes() {
        this.isLikedView = true;
        this.currentIndex = 0;
        document.querySelector('.app-container').classList.add('liked-view');
        this.showQuote(0);
        this.showNotification(`Viewing ${this.getLikedQuotesArray().length} liked quotes`);
    }
    
    showAllQuotes() {
        this.isLikedView = false;
        this.currentIndex = 0;
        document.querySelector('.app-container').classList.remove('liked-view');
        this.showQuote(0);
    }
    
    saveLikedQuotes() {
        localStorage.setItem('likedQuotes', JSON.stringify(Array.from(this.likedQuotes)));
    }
    
    loadLikedQuotes() {
        const saved = localStorage.getItem('likedQuotes');
        if (saved) {
            this.likedQuotes = new Set(JSON.parse(saved));
        }
        this.updateLikedCount();
    }
    
    updateLikedCount() {
        const count = this.likedQuotes.size;
        const btn = document.querySelector('.liked-quotes-btn');
        btn.textContent = count > 0 ? `⭐ ${count}` : '⭐';
    }
    
    shareQuote(event) {
        const currentQuote = this.isLikedView ? 
            this.getLikedQuotesArray()[this.currentIndex] : 
            this.quotes[this.currentIndex];
            
        const shareText = `"${currentQuote.text}" — ${currentQuote.author}, ${currentQuote.bookTitle}`;
        
        event.target.style.transform = 'scale(1.3)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 300);
        
        if (navigator.share) {
            navigator.share({
                title: 'Book Quote',
                text: shareText,
                url: window.location.href
            })
            .then(() => console.log('Successful share'))
            .catch((error) => {
                console.log('Error sharing:', error);
                this.fallbackShare(shareText);
            });
        } else {
            this.fallbackShare(shareText);
        }
    }
    
    fallbackShare(shareText) {
        navigator.clipboard.writeText(shareText)
            .then(() => {
                this.showNotification('Quote copied to clipboard! 📋');
            })
            .catch(() => {
                this.showNotification(`Copy this quote: ${shareText}`);
            });
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 10px;
            z-index: 1000;
            font-size: 16px;
            text-align: center;
            backdrop-filter: blur(10px);
            animation: fadeInOut 2s ease-in-out;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookQuoteShorts();
});