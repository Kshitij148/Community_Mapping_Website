import React, { useState } from "react";
import { Header, Image, Table, Icon, Label } from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";

const Dashboard = () => {

  // const lng = useSelector((state) => state.mapInfo.lng);
  // const lat = useSelector((state) => state.mapInfo.lat);
  // const communityName = useSelector((state) => state.mapInfo.communityName);


  const longitude = useSelector((state) => state.areaOfInterest.longitude);
  const latitude = useSelector((state) => state.areaOfInterest.latitude);
  const communityLocation = useSelector((state) => state.areaOfInterest.location);
  const communityName = useSelector((state) => state.areaOfInterest.name);

  const [commName, setCommName] = useState(communityName);

  return (
    <Table basic="very" celled collapsing>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Content</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>
            <Header>
              <Header.Content as="h4">Community Location</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{communityLocation}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">
              <Header.Content>Community Name</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{communityName}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">
              <Header.Content>AoI Coordinates</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>{longitude}, {latitude}</Table.Cell>
        </Table.Row>
        <Table.Row>
          <Table.Cell>
            <Header as="h4">
              <Header.Content>AoI Area</Header.Content>
            </Header>
          </Table.Cell>
          <Table.Cell>1234 sq. Kms</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table>
  );
};

export default Dashboard;
