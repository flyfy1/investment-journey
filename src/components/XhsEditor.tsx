import { useRef } from 'react';
import html2canvas from 'html2canvas-pro';
import { SymbolTrade, TradePair, tradesWeek250318 } from '../data/investment';
import moment from 'moment';

const appName = '小红书图片生成'
const standardTimeFormat = "YYYY-MM-DD HH:mm";

const XhsEditor = () => {
  const downloadableRef = useRef<HTMLDivElement>(null);

  const generateImage = async () => {
    if (!downloadableRef.current) return;
    
    try {
      const canvas = await html2canvas(downloadableRef.current, {
        scale: 1,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `小红书图片_${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
      console.error('生成图片失败:', error);
      alert('生成图片失败，请重试！');
    }
  };

  console.log(tradesWeek250318)

  return (
    <div className="flex max-w-7xl mx-auto p-5">
      <div>
        <header className="py-6 text-center">
          <h1 className="text-2xl font-bold text-red-700">{appName}</h1>
          <p className="text-gray-600 mt-2">编辑内容并生成1080x1350的图片</p>
        </header>
      
        <button 
          onClick={generateImage}
          className="px-4 py-2 bg-[#ff2442] text-white font-medium rounded hover:bg-[#e61c38] transition-colors"
        >
          生成并下载图片
        </button>
      
        <footer className="py-8 text-center text-gray-500 text-sm">
          <p>© 2024 {appName}</p>
        </footer>
      </div>


      {/* 预览区域 */}
      <div className="overflow-auto p-[10px] w-full">
        <div
          className="bg-white w-[1080px] h-[1350px] p-10"
          ref={downloadableRef}
        >
          <SingleCardView tradingPair={tradesWeek250318[1]}/>
        </div>
      </div>
    </div>
  );
};

function ft(momentObj: moment.Moment) {
  return momentObj.format(standardTimeFormat);
}

function SingleSymbolTrade(data: SymbolTrade) {
  // return (data.side == "sell" ? "-" : "+") + " " + data.symbol;
  return (data.type) + " " + data.symbol;
}

function computeAggregatePrice(combination: SymbolTrade[]) {
  let totalPrice = 0;
  for (let i = 0; i < combination.length; i++) {
    const trade = combination[i];
    let price = trade.price;
    if (trade.type == "sell") {
      price = -price;
    }
    totalPrice += price * (trade.quantity || 1);
  }
  return totalPrice;
}

function Overview({tradingPairs}: {tradingPairs: TradePair[]}) {
  return <div>
    <h1 className='text-red-500 text-6xl mx-auto mb-5'>美股实盘 - W250317～23</h1>
  </div>
}
function SingleCardView({tradingPair}: {tradingPair: TradePair}) {
  return <div>
    <h1 className='text-red-500 text-6xl mx-auto mb-5'>美股实盘 - W250317～23</h1>
    <h1 className='text-3xl'>{tradingPair.name}</h1>

    <div className=''>
      {tradingPair.trades.map((trade) => {
        // let thisPnL = trade.quantity * (trade.price - trade.fee);
        let aggregatePrice = computeAggregatePrice(trade.combination);

        const time = moment(trade.timestamp);

        return <div className=''>
          <h1 className='text-2xl'>{ft(time)}</h1>

          <div className='text-xl'>
            {trade.combination.length > 1 ?
              trade.combination.map((item) => (SingleSymbolTrade(item))).join(" ")
              : SingleSymbolTrade(trade.combination[0])} @ <span>{aggregatePrice}</span>, fee: <span>{trade.fee}</span>
          </div>
          {trade.thoughts ?
            <ul>
              {trade.thoughts.lines.map((line, idx) => (
                <li key={idx} className='text-xl'>{line}</li>
              ))}
            </ul>
            : ""
          }
        </div>
      })}
    </div>
    <div>
      <h1 className='text-2xl'>事后思考</h1>
      {tradingPair.afterThoughts.map((thought, index) => {
        const thoughtTime = moment(thought.timestamp!);
        return <div>
          <h2 className='text-2xl'>{ft(thoughtTime)}</h2>
          <ul key={index} className='text-xl'>
            {thought.lines.map((line, idx) => (
              <li key={idx} className='text-xl'>{line}</li>
            ))}
          </ul>
        </div>
      })}
    </div>
  </div>
}

export default XhsEditor; 