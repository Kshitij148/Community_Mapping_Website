import React from "react";
import { Header, Icon } from "semantic-ui-react";

const Profile = () => {
  return (
    <div>
      <Header as="h2" icon>
        <Icon name="user" circular />
        <Header.Content>User Name</Header.Content>
      </Header>
    </div>
  );
};

export default Profile;
