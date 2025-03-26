export type Trade = {
    timestamp: number

    quantity?: number   // default to 1
    fee: number

    combination: SymbolTrade[]
    thoughts?: Thought
}

// TODO: define a profit function to see the total profit
export type TradePair = {
    name?: string   // 可选的名字
    trades: Trade[]
    afterThoughts: Thought[]
}

export type SymbolTrade = {
    symbol: string
    type: "buy" | "sell" | "expire" | "exercise" | "exercised" | "assigned"
    price: number 
    quantity?: number // default to 1
}


export type Thought = {
    timestamp?: number // if not provided, means same time as trade (therefore no need to provide)
    lines: string[]
}

// parse string like "2023-10-01 12:00:00" to timestamp
// tzHourShift is the timezone hour shift, e.g. -8 for UTC+8
function timeString2Timestamp(timeString: string, tzHourShift: number = 8): number {
    const date = new Date(timeString);
    return date.getTime();
    // const utcDate = new Date(date.getTime() + (tzHourShift * 60 * 60 * 1000));
    // return utcDate.getTime();
}

export const tradesWeek250318: TradePair[] = [{
    name: "末日期权，想接盘；但没接到",
    trades: [{
        combination: [{ symbol: "SPY 18MAR25 560 P", type: "sell", price: 130 }],
        fee: 1.09,
        quantity: -1,

        timestamp: timeString2Timestamp("2025-03-17 22:42:00", +8),

        thoughts: {
            lines: `开盘大涨，看我的SPY是卖飞了
- 走一张2天的期权 试试水；接盘的话 也就是相当于接回来了上周的561 Call
- 因为过去几周 都是卖了PUT之后开始亏 - 我就不敢同时卖多张了`.split('\n'),
        },
    }],
    afterThoughts: [
        {
            timestamp: timeString2Timestamp("2025-03-18 09:23:00", +8),
            lines: ['现在账上USD有176k', '充足的子弹，可以接盘；我觉得我可以更加激进一些']
        }
    ],
}, {
    name: "接盘，CC，卖出Diagonal Spread，依然持有正股",
    trades: [{
        timestamp: timeString2Timestamp("2025-03-18, 22:12:00", +8),

        combination: [{ symbol: "SPY 18MAR25 562 P", type: "sell", price: 260 }],
        fee: 1.09,
        quantity: 1,

        thoughts: {
            lines: `因为我预期 SPY要涨；但我担心我560的那张 不能接盘
所以加一张稍微高一点的PUT，看能否接盘
最坏情况，就是均价559 接盘了2张SPY（卖期权有盈利）`.split('\n'),
        },
    }, {
        timestamp: timeString2Timestamp("2025-03-19, 21:30:00", +8),

        combination: [{ symbol: "SPY 19MAR25 562 P", type: "exercised", price: 0 }, { symbol: "SPY", type: "assigned", quantity: 100, price: 562 }],
        fee: 0,
        quantity: 1,
    }, {
        timestamp: timeString2Timestamp("2025-03-19, 21:31:00", +8),

        combination: [{ symbol: "SPY 19MAR25 568 C", type: "buy", price: 94 }, { symbol: "SPY 20MAR25 570 C", type: "sell", price: 184 }],
        fee: 0,
        quantity: 1,
        thoughts: {
            lines: toArray(`- 当时在这个diagonal spread的时候，预期价格如果有波动，都会反映在周三一天
- 所以想着这个策略，可以吃2天波动率的钱`)
        },
    }],
    afterThoughts: [{
        timestamp: timeString2Timestamp("2025-03-20 08:45", +8),
        lines: `在我卖这张Put的时候，当时股价应该是在560.4左右，就是说相比于直接买正股，收了80块钱的时间价值
这个接盘稍微有点风险 - 收盘价561，差点没接到
我当时可以卖得更加价内一些，放个564的可能更合适`.split('\n')
    }, {
        timestamp: timeString2Timestamp("2025-03-20 9:05", +8),
        lines: toArray(`有几点问题，我没考虑到：
1. 当天过期的CALL，时间价值损失太快了
2. 因为我只是希望 这个期权帮我对冲风险，并不想行权 - 导致我需要在它过期之前 盯盘（我的凌晨2:30 ～ 4:00）；这个影响了我的心态
3. 在它过期之前，SPY是有大幅上涨的。我平掉2腿中的一腿 这个操作，太快了；
4. 相比于直接卖这个call，我亏了30块。我觉得这个亏损，主要来自于 我把昨天行权的那个CALL，卖飞了`)
    }]
}, {
    name: "赌FOMC有上涨 赌输了",
    trades: [{
        timestamp: timeString2Timestamp("2025-03-18, 21:40"),
        combination: [{ symbol: "SPY 19MAR25 570 C", type: "buy", price: 110 }],
        fee: 0,

        thoughts: {
            lines: `开盘走低，我预期明天最差也是平的，所以就买了一个CALL
同时我还挂单了一个556的PUT，今天过期的卖单
因为明天会有结果公布，不敢下很大的赌注`.split('\n'),
        },
    }, {
        timestamp: timeString2Timestamp("2025-03-20, 02:35"),
        combination: [{ symbol: "SPY 19MAR25 570 C", type: "sell", price: 28 }],
        fee: 0,

        thoughts: {
            lines: ['赌输了，卖出回血'],
        },
    }],
    afterThoughts: [{
        timestamp: timeString2Timestamp("2025-03-20 08:45", +8),
        lines: `在前一天结束的时候，股价就已经很低了；我就应该知道：这个交易是亏了
在当天听证会的时候，股价有几个瞬间 冲高到了570以上；回过头来看，这个其实是有点卖飞了`.split("\n")
    }]
}, {
    name: "稍微有点卖飞的call，但是赚钱了",
    trades: [{
        timestamp: timeString2Timestamp("2025-03-19 21:31"),

        combination: [{ symbol: "SPY  19MAR25 564 C", type: "buy", price: 200 }],
        fee: 0,

        thoughts: {
            lines: ["因为预期大涨，看Call的价格还算可以接受，就买一张下个赌注"]
        },
    },{
        timestamp: timeString2Timestamp("2025-03-19 21:34"),

        combination: [{ symbol: "SPY  19MAR25 564 C", type: "sell", price: 230 }],
        fee: 0,

        thoughts: {
            lines: ["因为预期大涨，看Call的价格还算可以接受，就买一张下个赌注"]
        },
    },{
        timestamp: timeString2Timestamp("2025-03-20 01:16"),

        combination: [{ symbol: "SPY  19MAR25 564 C", type: "buy", price: 190 }],
        fee: 0,

        thoughts: {
            lines: ["- 接着挂个更低的单，吃波动的收益"]
        },
    },{
        timestamp: timeString2Timestamp("2025-03-19 02:31"),

        combination: [{ symbol: "SPY  19MAR25 564 C", type: "sell", price: 260 }],
        fee: 0,
    },
],
    afterThoughts: [{
        timestamp: timeString2Timestamp("2025-03-20 08:50"),
        lines: `我觉得，我的这个操作，还是有点过于频繁了
如果就拿着 什么都不做 - 到收盘价567 - 也能价值300 - 比我这么反复买卖要来的好（但未来谁也不知道）
我感觉期权的定价，主要来自于BS公式 - 于是，在这种重大新闻之前，买期权 可能是一个更加划算/更高胜率的事情`.split('\n')
    }]
}, {
    name: "合理的 可以接盘的 PUT",
    trades: [{
        timestamp: timeString2Timestamp("2025-03-19, 22:12:00", +8),

        combination: [{ symbol: "SPY  21MAR25 558 P", type: "sell", price: 226 }],
        fee: 1.14,

        thoughts: {
            lines: toArray(`- 我还是长期看多，556接盘我愿意
- 我这样每周赚2张期权的钱，相当于200股 每周能拿2块钱的点`)
        },
    }],
    afterThoughts: [{
        timestamp: timeString2Timestamp("2025-03-22 9:07"),
        lines: toArray(`- 卖在了低点上，挺好的
- 有点操作失误的，是在涨上来后，没平掉 - 否则能赚的更多（再买一张末日）`)
    }]
}, {
    name: "微微赚钱的CALL",
    trades: [{
        timestamp: timeString2Timestamp("2025-03-20, 21:31"),

        combination: [{ symbol: "SPY  21MAR25 562 C", type: "buy", price: 110 }],
        fee: 0,

        thoughts: {
            lines: toArray(`- 看SPY跌下来了，觉得后面肯定要涨回来；买个末日CALL准备着`)
        },
    }, {
        timestamp: timeString2Timestamp("2025-03-20, 22:12:00", +8),

        combination: [{ symbol: "SPY  21MAR25 562 C", type: "sell", price: 50 }],
        fee: 0,
    }],
    afterThoughts: [{
        timestamp: timeString2Timestamp("2025-03-22 9:07"),
        lines: toArray(`可能是因为末日call的关系，卖出的有点早了；可能换成下周到期的call，会更加安心一些`)
    }]
}
]

function toArray(str: string) {
    return str.split('\n').map((line) => {
        line = line.trim()
        if(line.startsWith("-")) {
            line = line.substring(1).trim()
        }
        return line
    }).filter((line) => line.length > 0);
}