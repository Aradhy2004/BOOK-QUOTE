class BookQuoteShorts {
    constructor() {
        this.quotes = [];
        this.currentIndex = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        
        this.init();
    }
    
    async init() {
        await this.loadQuotes();
        this.setupEventListeners();
        this.showQuote(this.currentIndex);
        this.startAutoPlay();
    }
    
    async loadQuotes() {
        try {
            const response = await fetch('data/quotes.json');
            const data = await response.json();
            this.quotes = data.quotes;
        } catch (error) {
            console.error('Error loading quotes:', error);
            // Fallback quotes
            this.quotes = [
                {
                    id: 1,
                    text: "Fallback quote - Books are a uniquely portable magic.",
                    bookTitle: "On Writing",
                    author: "Stephen King"
                }
            ];
        }
    }
    
    setupEventListeners() {
        // Navigation buttons
        document.querySelector('.next-btn').addEventListener('click', () => this.nextQuote());
        document.querySelector('.prev-btn').addEventListener('click', () => this.prevQuote());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') this.nextQuote();
            if (e.key === 'ArrowLeft') this.prevQuote();
        });
        
        // Touch/swipe support
        this.setupSwipe();
        
        // Like button
        document.querySelector('.like-btn').addEventListener('click', (e) => this.toggleLike(e));
    }
    
    setupSwipe() {
        let startX = 0;
        const container = document.querySelector('.app-container');
        
        container.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });
        
        container.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
                if (diff > 0) {
                    this.nextQuote();
                } else {
                    this.prevQuote();
                }
            }
        });
    }
    
    showQuote(index) {
        if (this.isTransitioning || index < 0 || index >= this.quotes.length) return;
        
        this.isTransitioning = true;
        const quote = this.quotes[index];
        const card = document.querySelector('.quote-card');
        
        // Fade out current quote
        card.style.opacity = '0';
        
        setTimeout(() => {
            // Update content
            document.querySelector('.quote-text').textContent = `"${quote.text}"`;
            document.querySelector('.book-title').textContent = quote.bookTitle;
            document.querySelector('.author').textContent = `— ${quote.author}`;
            
            // Reset like state
            document.querySelector('.like-btn').classList.remove('liked');
            
            // Fade in new quote
            card.style.opacity = '1';
            
            this.currentIndex = index;
            this.updateProgress();
            this.isTransitioning = false;
        }, 300);
    }
    
    nextQuote() {
        const nextIndex = (this.currentIndex + 1) % this.quotes.length;
        this.showQuote(nextIndex);
        this.resetAutoPlay();
    }
    
    prevQuote() {
        const prevIndex = this.currentIndex === 0 ? this.quotes.length - 1 : this.currentIndex - 1;
        this.showQuote(prevIndex);
        this.resetAutoPlay();
    }
    
    updateProgress() {
        const progress = ((this.currentIndex + 1) / this.quotes.length) * 100;
        document.querySelector('.progress').style.width = `${progress}%`;
    }
    
    startAutoPlay() {
        this.autoPlayInterval = setInterval(() => {
            this.nextQuote();
        }, 5000); // Change quote every 5 seconds
    }
    
    resetAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.startAutoPlay();
    }
    
    toggleLike(event) {
        event.target.classList.toggle('liked');
        // Here you would typically send this to a backend
        console.log('Quote liked:', this.quotes[this.currentIndex].id);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BookQuoteShorts();
});