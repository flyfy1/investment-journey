import { useRef, useState } from 'react';
import html2canvas from 'html2canvas-pro';


const XhsEditorSideBySide = () => {
  const downloadableRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5); // 默认缩放比例为0.5

  const generateImage = async () => {
    if (!downloadableRef.current) return;
    
    try {
      const canvas = await html2canvas(downloadableRef.current, {
        scale: 1,
        useCORS: true,
        logging: true,
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
    <div className="flex flex-row gap-5 max-w-7xl mx-auto p-5">
      {/* 编辑区域 */}
      <div className="w-1/5 flex flex-col gap-4">
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
        <div className="mx-[5px] p-[10px]">
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
      <div className="w-4/5 overflow-auto p-2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">预览</h2>
        <div style={{maxWidth: "100%", transform: `scale(${scale})`}}>
          <div 
              className="w-[1080px] h-[1920px]"
              ref={downloadableRef} 
          >
            <div className='bg-white' style={{height: "100%", width: "100%"}}>
              <h1 className='underline text-red-500 text-8xl'>美股投资旅程</h1>
            </div>
              {/* 这里去加入最近的投资结构 */}
          </div>
        </div>
      </div>
    </div>
  );
};