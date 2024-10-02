import { Typography } from 'antd';

const AppFooter = () => {
  return (
    <div className="flex justify-evenly h-auto">
      <Typography.Link href="tel:+123456789">
        direction_naf@norsys.fr
      </Typography.Link>
      <Typography.Link href="https://www.google.com" target={'_blank'}>
        Privacy Policy
      </Typography.Link>
      <Typography.Link href="https://www.google.com" target={'_blank'}>
        Terms of Use
      </Typography.Link>
    </div>
  );
};
export default AppFooter;
