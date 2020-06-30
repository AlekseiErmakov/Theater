const invoices = [
    {
        "customer": "MDT",
        "performance": [
            {
                "playId": "Гамлет",
                "audience": 55,
                "type": "tragedy"
            },
            {
                "playId": "Ромео и Джульетта",
                "audience": 35,
                "type": "tragedy"
            },
            {
                "playId": "Отелло",
                "audience": 40,
                "type": "comedy"
            }
        ]
    }
];


const format = new Intl.NumberFormat("ru-RU",
    {
        style: "currency", currency: "RUB",
        minimumFractionDigits: 2
    }).format;

function processInvoices(invoices) {
    const results = [];
    for (let invoice of invoices) {
        results.push(statement(invoice));
    }
    return results;
}

function statement(invoice) {
    let totalAmount = 0;
    let totalVolumeCredits = 0;
    const bills = [];
    for (let perf of invoice.performance) {
        const play = getPlayByType(perf.type);
        const amount = play.calculateTotalAmount(perf.audience);
        const volumeCredits = play.calculateVolumeCredits(perf.audience);
        let bill = new Bill(perf.playId, perf.audience, amount);
        bills.push(bill);
        totalAmount += amount;
        totalVolumeCredits += volumeCredits;
    }
    return processResult(invoice.customer, bills, totalAmount, totalVolumeCredits);
}

function getPlayByType(type) {
    const plays = [new Tragedy("tragedy", 40000, 30),
        new Comedy('comedy', 30000, 20)];
    for (let play of plays) {
        if (play.getType() === type) {
            return play;
        }
    }
    throw new Error(`неизвестный тип: ${type}`);
}

function processResult(customer, bills, totalAmount, totalVolumeCredits) {
    let result = `Счет для ${customer}\n`;
    for (let bill of bills) {
        result += ` ${bill.getName()}: ${format(bill.getAmount())}`;
        result += ` (${bill.getAudience()} мест)\n`;
    }
    result += `Итого с вас ${format(totalAmount)}\n`;
    result += `Вы заработали ${totalVolumeCredits} бонусов\n`;
    return result;
}

function Play(type, fixPrice, standartAudience) {
    this.type = type;
    this.fixPrice = fixPrice;
    this.standartAudience = standartAudience;

    this.getType = function () {
        return this.type;
    }
}

function Tragedy(type, fixPrice, standartAudience) {
    Play.call(this, type, fixPrice, standartAudience);

    this.calculateTotalAmount = function (audience) {
        return (audience > this.standartAudience) ? this.fixPrice + 1000 * (audience - this.standartAudience) : this.fixPrice;
    };

    this.calculateVolumeCredits = function (audience) {
        return Math.max(audience - standartAudience, 0);
    }
}

function Comedy(type, fixPrice, standartAudience) {
    Play.call(this, type, fixPrice, standartAudience);

    this.calculateTotalAmount = function (audience) {
        return (audience > this.standartAudience) ? this.fixPrice + 10000 + 500 * (audience - this.standartAudience) : this.fixPrice;
    };

    this.calculateVolumeCredits = function (audience) {
        return Math.max(audience - this.standartAudience, 0) + Math.floor(audience / 5);
    }
}

function Bill(name, audience, amount) {
    this.name = name;
    this.audience = audience;
    this.amount = amount;

    this.getName = function () {
        return this.name;
    };

    this.getAudience = function () {
        return this.audience;
    };

    this.getAmount = function () {
        return this.amount;
    };

}

console.log(processInvoices(invoices));