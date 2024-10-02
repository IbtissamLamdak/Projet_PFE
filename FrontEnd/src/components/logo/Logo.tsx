import { Space } from 'antd';

type LogoType = {
  collapsed: boolean;
};

const Logo = ({ collapsed }: LogoType) => {
  return (
    <div className="flex items-center justify-center p-2">
      <Space>
        <div>
          <img className="w-12" src="/norsys-logo.jpg" alt="norys-logo" />
        </div>
        {/* <div className={`flex flex-col ${collapsed && 'hidden'}`}>
          <span className="font-bold text-lg">norsys</span>
          <span className="font-bold text-xs">GROUP</span>
        </div> */}
      </Space>
    </div>
  );
};

export default Logo;
