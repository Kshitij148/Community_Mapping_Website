/*
 * Author: Maria Caravez
 * Description: This component is dashboard view used to
 * display the information within the community info object
 * in the Redux store aoiSlice within a table collection.
 */

import {
  Header,
  List,
  Table,
  Segment,
  Label,
  Button,
  Message,
} from "semantic-ui-react";
import { useDispatch, useSelector } from "react-redux";
import { Rnd } from "react-rnd";
import { aoiActions } from "../redux-store/aoiSlice";

const Dashboard = () => {
  const dispatch = useDispatch();

  // Used to check if dashboard should display information
  const zoom = useSelector((state) => state.mapInfo.zoom);

  // AoI Redux Slice objects to display
  const bounds = useSelector((state) => state.areaOfInterest.bounds);
  const area = useSelector((state) => state.areaOfInterest.area);
  const communityInfo = useSelector(
    (state) => state.areaOfInterest.communityInfo
  );

  /*
   * Will trigger an update in MapBoxBase Component
   * if user has clicked the refresh button
   */
  const handleRefresh = () => {
    dispatch(aoiActions.updateInfo({ update: true }));
  };

  // Dashboard View Begins
  return (
    <Rnd
      default={{
        x: -400,
        y: 100,
        width: 450,
        height: 211,
      }}
      minWidth={300}
      minHeight={211}
      maxHeight={525}
      bounds="window"
    >
      <Segment raised padded="very">
        <Label
          color="blue"
          attached="top"
          size="huge"
          style={{ textAlign: "center" }}
        >
          Area of Interest
        </Label>
        {zoom < 17 && (
          <Message color="red">
            To set <b>Area of Interest</b> and view dashboard, zoom in to at
            least <b>Zoom Level: 17</b>.
          </Message>
        )}
        {zoom > 17 && (
          <Table basic="very" celled collapsing style={{ paddingTop: "2vh" }}>
            <Table.Header fullWidth>
              <Table.Row>
                <Table.HeaderCell>Title</Table.HeaderCell>
                <Table.HeaderCell>Content</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>

              {/* AoI Information */}
              {communityInfo.map((item, i) => (
                <Table.Row key={i}>
                  <Table.Cell>
                    <Header as="h4">
                      <Header.Content>{item.type}</Header.Content>
                    </Header>
                  </Table.Cell>
                  <Table.Cell>{item.label}</Table.Cell>
                </Table.Row>
              ))}

              {/* AoI Bounds */}
              <Table.Row>
                <Table.Cell>
                  <Header as="h4">
                    <Header.Content>AoI Bounds</Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>
                  <List>
                    {bounds.map((item, i) => (
                      <List.Item key={i}>
                        <b>N: </b>
                        {item.north}, <b>E: </b>
                        {item.east}, <b>S: </b>
                        {item.south}, <b>W: </b>
                        {item.west}
                      </List.Item>
                    ))}
                  </List>
                </Table.Cell>
              </Table.Row>
              {/* AoI Area */}
              <Table.Row>
                <Table.Cell>
                  <Header as="h4">
                    <Header.Content>AoI Area</Header.Content>
                  </Header>
                </Table.Cell>
                <Table.Cell>{area} sq km </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )}

        {/* Refresh Button */}
        <Button
          attached="bottom"
          corner="right"
          icon={{ name: "refresh", color: "blue" }}
          circular
          style={{ backgroundColor: "#dae9f5" }}
          onClick={handleRefresh}
        />
      </Segment>
    </Rnd>
  );
};

export default Dashboard;
