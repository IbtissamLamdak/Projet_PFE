import React, { useEffect, useState } from 'react';
import { Avatar, Dropdown, MenuProps, Modal, Space } from 'antd';
import {
  PoweroffOutlined,
  ProfileOutlined,
  DownOutlined,
} from '@ant-design/icons';
import useLogout from '../../api/auth/useLogout';
import useAuth from '../../hooks/auth/useAuth';
import useFetchInfo from '../../api/auth/useFetchInfo';

interface UserProfile {
  nom: string;
  prenom: string;
  telephone: string;
  email: string;
  cin: string;
  adresse: string;
  poste: string;
  specialite: string;
}

type AppHeaderPropsType = {
  children?: React.ReactNode;
};

const AppHeader: React.FC<AppHeaderPropsType> = ({ children }) => {
  const { setAuth } = useAuth();
  const { logout, isLoading, isSuccess } = useLogout();
  const {
    isLoading: loadingUserInfo,
    userInfo,
    isSuccess: successUserInfo,
    refetch,
  } = useFetchInfo();
  const [username, setUsername] = useState('');

  useEffect(() => {
    refetch();
    setUsername(userInfo?.username ?? '');
  }, [userInfo, refetch]);

  const handleLogout = () => {
    logout();
    setAuth({});
    localStorage.removeItem('access_token');
  };

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isProfileVisible, setIsProfileVisible] = useState(false);

  const showProfileModal = () => {
    setUserProfile(
      userInfo
        ? {
            nom: userInfo.nom,
            prenom: userInfo.prenom,
            telephone: userInfo.telephone,
            email: userInfo.email,
            cin: userInfo.cin,
            adresse: userInfo.adresse,
            poste: userInfo.post,
            specialite: userInfo.specialite,
          }
        : null
    );
    setIsProfileVisible(true);
  };

  const hideProfileModal = () => {
    setIsProfileVisible(false);
  };
  const profileLineStyle: React.CSSProperties = {
    marginBottom: '10px',
  };

  const items: MenuProps['items'] = [
    {
      key: '1',
      label: <span> Voir mon profil</span>,
      icon: <ProfileOutlined />,
      onClick: showProfileModal,
    },
    {
      type: 'divider',
    },
    {
      key: '2',
      label: <span>Se déconnecter</span>,
      icon: <PoweroffOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex justify-between">
      {children}
      <Space align="center" className="mr-3">
        <Avatar size={30} className="flex items-center justify-center">
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <span>{loadingUserInfo ? 'Loading...' : username}</span>
        <Dropdown
          menu={{ items }}
          trigger={['click']}
          className="cursor-pointer"
          mouseEnterDelay={50}
          mouseLeaveDelay={50}
        >
          <span role="button" onClick={(e) => e.preventDefault()}>
            <DownOutlined />
          </span>
        </Dropdown>
      </Space>

      <Modal
        title={
          <div className="flex items-center gap-2">
            <Avatar size={32} className="flex align-middle items-center">
              {username.charAt(0).toUpperCase()}
            </Avatar>{' '}
            Mon Profil
          </div>
        }
        open={isProfileVisible}
        onCancel={hideProfileModal}
        footer={null}
      >
        {userProfile && (
          <div className="profile-details flex flex-col gap-2">
            {userProfile.cin ? (
              <>
                <div style={profileLineStyle}>Nom: {userProfile.nom}</div>
                <div style={profileLineStyle}>Prénom: {userProfile.prenom}</div>
                <div style={profileLineStyle}>
                  Téléphone: {userProfile.telephone}
                </div>
                <div style={profileLineStyle}>Email: {userProfile.email}</div>
                <div style={profileLineStyle}>CIN: {userProfile.cin}</div>
                <div style={profileLineStyle}>
                  Adresse: {userProfile.adresse}
                </div>
                <div style={profileLineStyle}>Poste: {userProfile.poste}</div>
                <div style={profileLineStyle}>
                  Spécialité: {userProfile.specialite}
                </div>
              </>
            ) : userInfo ? (
              <>
                <div style={profileLineStyle}>
                  Username: {userInfo.username}
                </div>
                <div style={profileLineStyle}>Email: {userInfo.email}</div>
                <div style={profileLineStyle}>Role: {userInfo.role}</div>
              </>
            ) : (
              <div style={profileLineStyle}>Email: {userProfile.email}</div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AppHeader;
