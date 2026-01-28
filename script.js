// Initialize vote counts and user votes on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeVotes();
});

function initializeVotes() {
    // Get all cards on the page
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const cardId = card.getAttribute('data-card-id');
        const pageId = getPageId();
        const storageKey = `${pageId}-${cardId}`;
        
        // Load vote count from localStorage
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            const data = JSON.parse(savedData);
            updateVoteCount(cardId, data.count);
            updateButtonStates(cardId, data.userVote);
        } else {
            // Initialize with 0 votes
            updateVoteCount(cardId, 0);
        }
    });
}

function getPageId() {
    // Get the page identifier from the URL
    const path = window.location.pathname;
    if (path.includes('assignment0')) return 'assignment0';
    if (path.includes('assignment2')) return 'assignment2';
    if (path.includes('assignment4')) return 'assignment4';
    return 'default';
}

function vote(cardId, voteType) {
    const pageId = getPageId();
    const storageKey = `${pageId}-${cardId}`;
    
    // Get current data
    const savedData = localStorage.getItem(storageKey);
    let data = savedData ? JSON.parse(savedData) : { count: 0, userVote: null };
    
    // Check if user has already voted
    if (data.userVote !== null) {
        // User has already voted, remove their previous vote
        if (data.userVote === 'up') {
            data.count -= 1;
        } else if (data.userVote === 'down') {
            data.count += 1;
        }
        
        // If clicking the same button, just remove the vote
        if (data.userVote === voteType) {
            data.userVote = null;
        } else {
            // Change vote to the opposite
            if (voteType === 'up') {
                data.count += 1;
            } else {
                data.count -= 1;
            }
            data.userVote = voteType;
        }
    } else {
        // User hasn't voted yet, add their vote
        if (voteType === 'up') {
            data.count += 1;
        } else {
            data.count -= 1;
        }
        data.userVote = voteType;
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(data));
    
    // Update UI
    updateVoteCount(cardId, data.count);
    updateButtonStates(cardId, data.userVote);
}

function updateVoteCount(cardId, count) {
    const countElement = document.getElementById(`count-${cardId}`);
    if (countElement) {
        countElement.textContent = count;
    }
}

function updateButtonStates(cardId, userVote) {
    const card = document.querySelector(`[data-card-id="${cardId}"]`);
    if (!card) return;
    
    const upvoteButton = card.querySelector('.upvote');
    const downvoteButton = card.querySelector('.downvote');
    
    // Reset all buttons
    upvoteButton.classList.remove('active');
    downvoteButton.classList.remove('active');
    upvoteButton.disabled = false;
    downvoteButton.disabled = false;
    
    // Apply active state based on user vote
    if (userVote === 'up') {
        upvoteButton.classList.add('active');
    } else if (userVote === 'down') {
        downvoteButton.classList.add('active');
    }
}
