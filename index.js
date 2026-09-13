const key = 'res';

function ldsave() {
    let raw = localStorage.getItem(key);
    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function save(rows) {
    localStorage.setItem(key, JSON.stringify(rows));
}

function formatTime(iso) {
    return new Date(iso).toLocaleString('ru-RU');
}

function renderTable(rows) {
    let tbody = document.getElementById('results-body');
    tbody.innerHTML = '';
    rows.forEach(function (row) {
        let tr = document.createElement('tr');
        let values = [row.x, row.y, row.r, row.popad, formatTime(row.time), ''];
        for (let i = 0; i < values.length; i++) {
            let td = document.createElement('td');
            td.textContent = values[i];
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
}

let rows = ldsave();
renderTable(rows);

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const cx = canvas.width / 2;
const cy = canvas.height / 2;
const scale = 70;
const R = scale;

function X(x) { return cx + x; }
function Y(y) { return cy - y; }

ctx.fillStyle = '#fff';
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.fillStyle = '#5BA3D9';

// треугольник
ctx.beginPath();
ctx.moveTo(X(0), Y(0));
ctx.lineTo(X(R / 2), Y(0));
ctx.lineTo(X(0), Y(R / 2));
ctx.closePath();
ctx.fill();

// полукргу
ctx.beginPath();
ctx.moveTo(X(0), Y(0));
ctx.arc(X(0), Y(0), R, Math.PI, -Math.PI / 2, false);
ctx.closePath();
ctx.fill();

// прямоуг
ctx.fillRect(X(0), Y(0), R / 2, R);

// ГОООЛ
ctx.strokeStyle = '#000';
ctx.fillStyle = '#000';
ctx.lineWidth = 1.5;
ctx.beginPath();
ctx.moveTo(40, cy);
ctx.lineTo(canvas.width - 40, cy);
ctx.moveTo(cx, canvas.height - 40);
ctx.lineTo(cx, 40);
ctx.stroke();

// стрелки
ctx.beginPath();
ctx.moveTo(canvas.width - 40, cy);
ctx.lineTo(canvas.width - 50, cy - 5);
ctx.lineTo(canvas.width - 50, cy + 5);
ctx.moveTo(cx, 40);
ctx.lineTo(cx - 5, 50);
ctx.lineTo(cx + 5, 50);
ctx.fill();

ctx.font = '14px sans-serif';
ctx.fillText('x', canvas.width - 32, cy - 10);
ctx.fillText('y', cx + 8, 32);


// засечки
ctx.beginPath();
ctx.moveTo(X(-R), cy - 5);
ctx.lineTo(X(-R), cy + 5);
ctx.stroke();
ctx.fillText('-R', X(-R) - 12, cy + 18);

ctx.beginPath();
ctx.moveTo(cx - 5, Y(-R));
ctx.lineTo(cx + 5, Y(-R));
ctx.stroke();
ctx.fillText('-R', cx + 8, Y(-R) + 4);

ctx.beginPath();
ctx.moveTo(X(-R / 2), cy - 5);
ctx.lineTo(X(-R / 2), cy + 5);
ctx.stroke();
ctx.fillText('-R/2', X(-R / 2) - 12, cy + 18);

ctx.beginPath();
ctx.moveTo(cx - 5, Y(-R / 2));
ctx.lineTo(cx + 5, Y(-R / 2));
ctx.stroke();
ctx.fillText('-R/2', cx + 8, Y(-R / 2) + 4);

ctx.beginPath();
ctx.moveTo(X(R / 2), cy - 5);
ctx.lineTo(X(R / 2), cy + 5);
ctx.stroke();
ctx.fillText('R/2', X(R / 2) - 12, cy + 18);

ctx.beginPath();
ctx.moveTo(cx - 5, Y(R / 2));
ctx.lineTo(cx + 5, Y(R / 2));
ctx.stroke();
ctx.fillText('R/2', cx + 8, Y(R / 2) + 4);

ctx.beginPath();
ctx.moveTo(X(R), cy - 5);
ctx.lineTo(X(R), cy + 5);
ctx.stroke();
ctx.fillText('R', X(R) - 12, cy + 18);

ctx.beginPath();
ctx.moveTo(cx - 5, Y(R));
ctx.lineTo(cx + 5, Y(R));
ctx.stroke();
ctx.fillText('R', cx + 8, Y(R) + 4);


document.getElementById('check').addEventListener('click', function () {
    let xvod = document.querySelectorAll('input[name="x"]:checked');
    if (xvod.length !== 1) {
        alert("только один X");
        return;
    }

    let x = Number(xvod[0].value);

    let yvvod = document.getElementById('y').value.trim();
    let y = Number(yvvod);
    if (yvvod === '' || Number.isNaN(y) || y < -3 || y > 3) {
        alert("Y от -3 до 3");
        return;
    }

    let rvvod = document.querySelectorAll('input[name="r"]:checked');

    if (rvvod.length !== 1) {
        alert("Только одно R");
        return;
    }
    let r = Number(rvvod[0].value);

    let flag = false;

    if (x <= 0 && y >= 0 && (x * x + y * y) <= r * r) {
        flag = true;
    }

    if (x >= 0 && y>= 0 && x + y <= r / 2) {
        flag = true;
    }

    if (y <= 0 && x >= 0 && y >= -r &&  x <= r/2) {
        flag = true;
    }

    rows.push({
        x: x,
        y: y,
        r: r,
        popad: flag,
        time: new Date().toISOString()
    });

    save(rows);
    renderTable(rows);
});
