let objs = [];
let colors = ['#f71735', '#f7d002', '#1A53C0', '#232323'];

function setup() {
	// 建立 800*600 的畫布並將其放入 <main> 標籤中
	let canvas = createCanvas(800, 600);
	canvas.parent(document.querySelector('main'));
	rectMode(CENTER);
	objs.push(new DynamicShape());
}

function draw() {
	background(255);
	for (let i of objs) {
		i.run();
	}

	if (frameCount % int(random([15, 30])) == 0) {
		let addNum = int(random(1, 30));
		for (let i = 0; i < addNum; i++) {
			objs.push(new DynamicShape());
		}
	}
	for (let i = 0; i < objs.length; i++) {
		if (objs[i].isDead) {
			objs.splice(i, 1);
		}
	}
}

function easeInOutExpo(x) {
	return x === 0 ? 0 :
		x === 1 ?
		1 :
		x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 :
		(2 - Math.pow(2, -20 * x + 10)) / 2;
}

class DynamicShape {
	constructor() {
		this.x = random(0.3, 0.7) * width;
		this.y = random(0.3, 0.7) * height;
		this.reductionRatio = 1;
		this.shapeType = int(random(4));
		this.animationType = 0;
		this.maxActionPoints = int(random(2, 5));
		this.actionPoints = this.maxActionPoints;
		this.elapsedT = 0;
		this.size = 0;
		this.sizeMax = width * random(0.01, 0.05);
		this.fromSize = 0;
		this.init();
		this.isDead = false;
		this.clr = random(colors);
		this.changeShape = true;
		this.ang = int(random(2)) * PI * 0.25;
		this.lineSW = 0;
	}

	show() {
		push();
		translate(this.x, this.y);
		if (this.animationType == 1) scale(1, this.reductionRatio);
		if (this.animationType == 2) scale(this.reductionRatio, 1);
		fill(this.clr);
		stroke(this.clr);
		strokeWeight(this.size * 0.05);
		if (this.shapeType == 0) {
			noStroke();
			circle(0, 0, this.size);
		} else if (this.shapeType == 1) {
			noFill();
			circle(0, 0, this.size);
		} else if (this.shapeType == 2) {
			noStroke();
			rect(0, 0, this.size, this.size);
		} else if (this.shapeType == 3) {
			noFill();
			rect(0, 0, this.size * 0.9, this.size * 0.9);
		} else if (this.shapeType == 4) {
			line(0, -this.size * 0.45, 0, this.size * 0.45);
			line(-this.size * 0.45, 0, this.size * 0.45, 0);
		}
		pop();
		strokeWeight(this.lineSW);
		stroke(this.clr);
		line(this.x, this.y, this.fromX, this.fromY);
	}

	move() {
		let n = easeInOutExpo(norm(this.elapsedT, 0, this.duration));
		if (0 < this.elapsedT && this.elapsedT < this.duration) {
			if (this.actionPoints == this.maxActionPoints) {
				this.size = lerp(0, this.sizeMax, n);
			} else if (this.actionPoints > 0) {
				if (this.animationType == 0) {
					this.size = lerp(this.fromSize, this.toSize, n);
				} else if (this.animationType == 1) {
					this.x = lerp(this.fromX, this.toX, n);
					this.lineSW = lerp(0, this.size / 5, sin(n * PI));
				} else if (this.animationType == 2) {
					this.y = lerp(this.fromY, this.toY, n);
					this.lineSW = lerp(0, this.size / 5, sin(n * PI));
				} else if (this.animationType == 3) {
					if (this.changeShape == true) {
						this.shapeType = int(random(5));
						this.changeShape = false;
					}
				}
				this.reductionRatio = lerp(1, 0.3, sin(n * PI));
			} else {
				this.size = lerp(this.fromSize, 0, n);
			}
		}

		this.elapsedT++;
		if (this.elapsedT > this.duration) {
			this.actionPoints--;
			this.init();
		}
		if (this.actionPoints < 0) {
			this.isDead = true;
		}
	}

	run() {
		this.show();
		this.move();
	}

	init() {
		this.elapsedT = 0;
		this.fromSize = this.size;
		this.toSize = this.sizeMax * random(0.5, 1.5);
		this.fromX = this.x;
		this.toX = this.fromX + (width / 10) * random([-1, 1]) * int(random(1, 4));
		this.fromY = this.y;
		this.toY = this.fromY + (height / 10) * random([-1, 1]) * int(random(1, 4));
		this.animationType = int(random(3));
		this.duration = random(20, 50);
	}
}

// 當 DOM 載入完成後執行
document.addEventListener('DOMContentLoaded', (event) => {
  const showWorkLink = document.getElementById('show-work');
  const showLectureLink = document.getElementById('show-lecture');
	const showQuizLink = document.getElementById('show-quiz');
  const iframeOverlay = document.getElementById('iframe-overlay');
  const lectureIframe = document.getElementById('lecture-iframe');
  const closeIframeButton = document.getElementById('close-iframe');

  // 第一個選項（第一單元作品）：在 iframe 中開啟指定的外部頁面
  if (showWorkLink) {
    showWorkLink.addEventListener('click', (e) => {
      e.preventDefault();
      lectureIframe.src = 'https://zhanyongyi1120-pixel.github.io/pop/';
      iframeOverlay.style.display = 'flex';
    });
  }

  // 點擊「第一單元講義」時的事件
  showLectureLink.addEventListener('click', (e) => {
    e.preventDefault(); // 防止連結跳轉
    // 設定 iframe 的來源網址並顯示
		lectureIframe.src = 'https://hackmd.io/@yongyi/rJarNZOgZl';
    iframeOverlay.style.display = 'flex';
  });

	// 第三個選項（測驗系統）：在 iframe 中開啟指定的外部頁面
	if (showQuizLink) {
		showQuizLink.addEventListener('click', (e) => {
			e.preventDefault();
			lectureIframe.src = 'https://zhanyongyi1120-pixel.github.io/20251103/';
			iframeOverlay.style.display = 'flex';
		});
	}

  // 點擊關閉按鈕時的事件
  closeIframeButton.addEventListener('click', () => {
    // 隱藏 iframe 並清除來源，以停止影片或音樂播放
    iframeOverlay.style.display = 'none';
    lectureIframe.src = '';
  });
});