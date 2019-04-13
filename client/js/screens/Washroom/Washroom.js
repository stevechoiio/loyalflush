import React from "react";
import { Text, View } from "react-native";
import { material } from "react-native-typography";
import StarRating from "react-native-star-rating";
import getDirections from "react-native-google-maps-directions";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button, Header } from "react-native-elements";
import BackButton from "../../components/BackButton";
import {
  Accordion,
  Container,
  Content,
  List,
  ListItem,
  Thumbnail,
  Left,
  Right,
  Body
} from "native-base";
const handleGetDirections = async (lat, long) => {
  await navigator.geolocation.getCurrentPosition(pos => {
    var crd = pos.coords;

    const data = {
      source: {
        latitude: crd.latitude,
        longitude: crd.longitude
      },
      destination: {
        latitude: lat,
        longitude: long
      },
      params: [
        {
          key: "travelmode",
          value: "walking"
        },
        {
          key: "dir_action",
          value: "navigate"
        }
      ]
    };

    getDirections(data);
  });
};
export default props => {
  let { reviews, refetch, data } = props;
  console.log(reviews);
  return (
    <View>
      <Header
        leftComponent={<BackButton />}
        centerComponent={{
          text: data.name,
          style: { color: "#fff", fontSize: 15 }
        }}
      />
      {/* <Image source={{uri: data.listOfPhotos.url}}></Image> */}
      <Text style={material.caption}>{data.address}</Text>

      <StarRating disabled={true} maxStars={5} rating={data.overallRating} />
      <View style={{ flex: 0, flexDirection: "row" }}>
        <Text>Toilet Seat covers</Text>
        <Icon name="check" size={15} color="black" />
      </View>
      <Text style={material.title}>Most Recent Review:</Text>
      <ListItem>
        <Left>
          {reviews.allReviews[0].user ? (
            <Text style={material.caption}>
              {reviews.allReviews[0].user.name}
            </Text>
          ) : (
            <Text style={material.caption}>Bob</Text>
          )}
        </Left>
        <Body>
          <Text>not bad</Text>
        </Body>
        <Right>
          <StarRating
            disabled={true}
            starSize={5}
            maxStars={5}
            rating={reviews.allReviews[0].rating}
          />
        </Right>
      </ListItem>

      <Accordion
        renderHeader={() => {
          return (
            <Text style={material.subheading}>
              see more reviews ({reviews.allReviews.length})
            </Text>
          );
        }}
        renderContent={() => {
          return (
            <List>
              {reviews.allReviews.map((review, index) => {
                return (
                  <ListItem key={index}>
                    <Left>
                      {review.user ? (
                        <Text style={material.caption}>{review.user.name}</Text>
                      ) : null}
                    </Left>
                    <Body>
                      <Text>cleaner than a virgin's dick</Text>
                    </Body>
                    <Right>
                      <StarRating
                        disabled={true}
                        starSize={5}
                        maxStars={5}
                        rating={review.rating}
                      />
                    </Right>
                  </ListItem>
                );
              })}
            </List>
          );
        }}
        dataArray={[{ title: 0, content: 0 }]}
        expanded={-1}
      />

      <Button
        onPress={() => handleGetDirections(data.locationLat, data.locationLong)}
        title="direction"
      />
      <Button
        onPress={() => {
          props.nav.navigate("Review", { refetch, data });
        }}
        title="review"
      />
    </View>
  );
};
