import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

const XhsEditor = () => {
  const downloadableRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5); // 默认缩放比例为0.5

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

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setScale(parseFloat(e.target.value));
  };

  return (
    <div className="flex flex-col md:flex-row gap-5 max-w-7xl mx-auto p-5">
      {/* 编辑区域 */}
      <div className="flex-1 flex flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-800">小红书编辑器</h2>
        <div className="flex gap-3">
          <button 
            onClick={generateImage}
            className="px-4 py-2 bg-[#ff2442] text-white font-medium rounded hover:bg-[#e61c38] transition-colors"
          >
            生成并下载图片
          </button>
        </div>
        
        {/* 缩放控制 */}
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">预览缩放: {(scale * 100).toFixed(0)}%</h3>
          <input 
            type="range" 
            min="0.1" 
            max="1" 
            step="0.05" 
            value={scale} 
            onChange={handleScaleChange}
            className="w-full"
          />
        </div>
      </div>
      
      {/* 预览区域 */}
      <div className="w-full overflow-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-4">预览</h2>
        <div className="overflow-auto">
          <div 
              className="border-[2px] border-gray-800 overflow-hidden shadow-lg bg-white p-10 text-[48px] leading-relaxed origin-top-left"
              ref={downloadableRef} 
              style={{
                width: '1080px',
                height: '1920px',
                transform: `scale(${scale})`,
                marginBottom: `${scale * 100 - 100}%`,
              }}
          >
              <h1 className='underline decoration-sky-500'>Testing Heading</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default XhsEditor; 