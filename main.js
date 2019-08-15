(function(){
    class GenerateBoard {
        constructor(name, size) {
            this.name = name;
            this.size = size;
            this.puzzle = [];
            this.success = [];
            this.icons = ['fa-diamond', 'fa-paper-plane-o', 'fa-anchor', 'fa-bolt', 'fa-cube', 'fa-leaf', 'fa-bicycle', 'fa-bomb'];
            this.board = document.querySelector('#board');
            this.renderedstars = document.querySelector('#stars');
            this.moves = document.querySelector('#moves');
            this.timerRef = document.querySelector('#timer');
            this.blockClick = false;
            this.count;
            this.temp = false;
            this.stars = 3;
            this.timer = {
                time: 0,
                data: '',
                display: '',
                initilized: false
            };
            this.handleClicks = this.handleClicks.bind(this);
        }
        init() {
            this.puzzle = this.randomSet(this.size);
            this.success = [];
            this.blockClick = false;
            this.count = 0;
            this.temp = false;
            this.renderStars(true);
            this.renderMoves(this.count);
            this.renderTime(this.timer.time);
            this.puzzle.forEach(item => {
                let card = `
                <div data-value="${item}" class="card-container">
                    <div class="card">
                        <div class="card-front"></div>
                        <div class="card-back">
                            <i class="fa ${this.icons[item]}"></i>
                        </div>
                    </div>
                </div>`;
               
                this.board.innerHTML += card;
            });
            this.board.addEventListener('click', this.handleClicks, true);
        }
        randomSet(size) {
            // let collection = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];
            let random = [];
            for(let i = 0; i<size; i++) {
                random.push(i);
            }
            for(let i = 0; i<size; i++) {
                random.push(i);
            }
            return random.sort(function() {
                return .5 - Math.random();
            });
            // return [0,2,4,2,1,3,6,5,5,7,3,1,0,7,4,6];
        }
        handleClicks(e) {
            e.stopPropagation();
            if(e.target.dataset['reset']) {
                this.reset();
            }
            let elem = e.path[2];
            if(elem.dataset.value && !this.blockClick && e.target.className === 'card-front') {
                if(!this.timer.initilized) {
                    this.timer.data = setInterval(() => {
                        this.timer.time++;
                        this.renderTime(this.timer.time);
                    }, 1000);
                    this.timer.initilized = true;
                } 
                this.renderMoves(this.count++);
                elem.className = 'card-container flip';
                let value = elem.dataset.value;
                if(this.temp) {
                    if(value === this.temp.value) {
                        this.success.push(value);
                        this.success.push(this.temp.value);
                        elem.className = 'card-container flip green';
                        this.temp.elem.className = 'card-container flip green';
                        this.temp = false;
                    } else if(!this.success.includes(value)) {
                        this.blockClick = true;
                        elem.className = 'card-container flip red';
                        this.temp.elem.className = 'card-container flip red';
                        setTimeout(() => {
                            elem.className = 'card-container';
                            this.temp.elem.className = 'card-container';
                            this.temp = false;
                            this.blockClick = false;
                        }, 1000);
                    }
                } else this.temp =  { value, elem };
                this.checkResult();
                this.renderStars(false);
            }
        }
        renderTime(time){
            let hours = Math.floor(time / 3600).toString().length === 1 ? '0' + Math.floor(time / 3600).toString() : Math.floor(time / 3600).toString();
            let minutes = Math.floor(time / 60).toString().length === 1 ? '0' + Math.floor(time / 60).toString() : Math.floor(time / 60).toString();
            let seconds = Math.floor(time % 60).toString().length === 1 ? '0' + Math.floor(time % 60).toString() : Math.floor(time % 60).toString();
            this.timer.display = `Time: ${hours}h:${(minutes)}m:${seconds}s`;
            this.timerRef.innerText = this.timer.display;
        }
        renderMoves() {
            this.moves.innerText = this.count + ' Moves';
        }
        renderStars(initialRender) {
            if(initialRender) {
                // document.querySelector('#star3').className = 'fa fa-star';
                this.renderedstars.childNodes[5].className = 'fa fa-star';
                this.renderedstars.childNodes[3].className = 'fa fa-star';
            }
            else if(11 < this.count && this.count < 20) {
                if(this.stars === 3) {
                    this.renderedstars.childNodes[5].className = 'fa fa-star-o';
                }
                this.stars = 2;
            } else if(this.count >= 20) {
                if(this.stars === 2) {
                    this.renderedstars.childNodes[3].className = 'fa fa-star-o';
                }
                this.stars = 1;
            }
        }
        checkResult() {
            if(this.puzzle.length === this.success.length) {
                setTimeout(() => {this.congratulate.call(this);}, 1000);
            }
        }
        congratulate() {
            this.board.innerHTML = `
            <div class="final">
                <div>Congratulation ${this.name}! You Won!</div>\
                <div>You completed the game in ${this.timer.display}</div>
                <div>With ${this.count} Moves and ${this.stars} Stars</div>
                <div>Wooooooo!</div>
                <button data-reset="resetButton" class="btn">PLAY AGAIN!</button>
            </div>`;
            this.resetTimer();
        }
        destroy() {
            this.puzzle = [];
            this.success = [];
            this.count = 0;
            this.stars = 3;
            this.board.innerHTML = '';
            this.board.removeEventListener('click', this.handleClicks, true);
            this.resetTimer();
        }
        resetTimer() {
            clearInterval(this.timer.data);
            this.timer = {
                time: 0,
                data: '',
                display: '',
                initilized: false
            };
        }
        reset() {
            this.destroy();
            document.querySelector('#initialform').style.display = 'flex';
        }
    }
    
    document.querySelector('#initialform').addEventListener('submit', (e) => {
        e.preventDefault();
        let name = e.target[0].value.trim();
        let level = Number(e.target[1].value);
    
        if(name) {
            document.querySelector('#initialform').style.display = 'none';
            let newBoard = new GenerateBoard(name, level);
            newBoard.init();
            document.querySelector('#reset').addEventListener('click', () => {
                newBoard.reset();
            });
        }
    });    
})();