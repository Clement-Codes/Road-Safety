import { View, Text, FlatList, Image, RefreshControl, Alert, ScrollView } from 'react-native'
import React, {useState, useEffect} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import EmptyState from '../../components/EmptyState'
import {getAllPosts, getLatestPosts} from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'
import database from '../../config'
import {ref, onValue, query, limitToLast, orderByChild, equalTo, get } from 'firebase/database'
import Distraction from '../../components/Distraction'
import DataRow from '../../components/DataRow'
import Map from '../../components/Map'
import DrivingDataChart from '../../components/DrivingDataChart'


const Home = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext()

  const [latestData, setLatestData] = useState(false);
  const [sessionData, setSessionData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (user){
        const collection = ref(database, user?.telematicDeviceID);
        const latestRecordQuery = query(collection, limitToLast(1));
        const snapshots = await get(collection);
        const unsubscribe = onValue(latestRecordQuery, (snapshot) => {
        if (snapshot.exists()) {
            setLatestData(Object.values(snapshot.val())[0])
            if (snapshots.exists()) {
              const data = snapshots.val();
              const groupedData = Object.values(data).reduce((acc, item) => {
                if (item && item.id === Object.values(snapshot.val())[0]['id']) {
                  if (!acc[item.id]) {
                    acc[item.id] = { ...item };
                  } else {
                    Object.keys(item).forEach(key => {
                      if (key !== 'id' && typeof item[key] === 'number') {
                        acc[item.id][key] = (acc[item.id][key] || 0) + item[key];
                      }
                    });
                  }
                }
                return acc
              },{})
              setSessionData(Object.values(groupedData)[0])
            }
          }
        }, (error) => {
          console.error("Error in onValue listener:", error);
        });
        
       

          return () => {
          unsubscribe();
        };
      }
    }

    fetchData();
  }, [user]);

  const {data: posts, refetch} = useAppwrite(getAllPosts)
  const {data: latestPosts} = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async() =>{
      setRefreshing(true);
      await refetch();
      setRefreshing(false);
  }
  const datad = {
    labels: ["Swim", "Bike", "Run"], // optional
    data: [0.4, 0.6, 0.8]
  };
  return (
    <SafeAreaView className="bg-primary h-full">
          <ScrollView  className="flex my-6 px-4 space-y-0">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoNewSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            {/* <SearchInput /> */}
            <View>
              {latestData ? (<View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg  pt-4 pb-4 my-2">
                <Text className="text-xl font-bold mb-4 text-center text-white">Road Risk and Severity Data</Text>
                <Map className="mb-4" risk={latestData.road_risk} severity={latestData.road_severity}/>
                <View className="p-4 mT-2">
                  <DataRow title="Road Risk (Yes / No):" value={severity?"Yes":"No"} />
                  <DataRow title="Road Severity:" value={severity == 0?"Low":severity == 1?"Medium":"High"} />
                </View>

              </View>):(<></>)
              }
              <View>
              {latestData ? (
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Road Risk and Severity Data</Text>
                    <DrivingDataChart latestData ={latestData} />
                  </View>
                ):(<></>)
              }
            </View>
              {latestData ? (
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Live Data</Text>
                    <View>
                      <DataRow title="Latitude" value={latestData.harsh_acceleration} />
                      <DataRow title="Longitude" value={latestData.harsh_acceleration} />
                      <DataRow title="Road" value={latestData.telematic_name} />
                      <DataRow title="Weather" value={latestData.weather_condition} />
                      <DataRow title="Harsh Braking" value={latestData.harsh_braking} />
                      <DataRow title="Over Speeding" value={latestData.over_speeding} />
                      <DataRow title="Over Speeding Score" value={latestData.over_speeding_score} />
                      <DataRow title="Time of Driving" value={latestData.time_of_driving_score} />
                      <DataRow title="Weather Condition Score" value={latestData.weather_condition_score} />
                      <DataRow title="Prolong Violations Score" value={latestData.prolong_violations_score} />
                      <DataRow title="Total Risk Score" value={latestData.risk_score} />
                    </View>
                  </View>
                ):(<></>)
              }
            </View>
            <View>
              {latestData ? (
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Road Risk and Severity Data</Text>
                    <View>
                      <DataRow title="Road Risk" value={latestData.road_risk} />
                      <DataRow title="Road Severity" value={latestData.road_severity} />
                    </View>
                  </View>
                ):(<></>)
              }
            </View>
            <View>
              {latestData ? (
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Driving Behavior Risk Assessment</Text>
                    {latestData.cluster == 0 && <View>
                                                  <DataRow title="Driver Risk" value="Medium" />
                                                </View>
                    }
                    {latestData.cluster == 1 && <View>
                                                  <DataRow title="Driver Risk" value="High" />
                                                </View>
                    }
                    {latestData.cluster == 2 && <View>
                                                  <DataRow title="Driver Risk" value="Low"/>
                                                </View>
                    }                    
                  </View>
                ):(<></>)
              }
            </View>
            <View>
              <Distraction/>
            </View>
            <View>
              {sessionData ? (
                  <View className="bg-black-100 rounded-2xl border-2 border-black-200 rounded-lg p-4 my-2">
                    <Text className="text-xl font-bold mb-4 text-center text-white">Session Data</Text>
                    <View>
                      <DataRow title="Harsh Acceleration" value={sessionData.harsh_acceleration} />
                      <DataRow title="Harsh Braking" value={sessionData.harsh_braking} />
                      <DataRow title="Over Speeding" value={sessionData.over_speeding} />
                      <DataRow title="Over Speeding Score" value={sessionData.over_speeding_score} />
                      <DataRow title="Time of Driving" value={sessionData.time_of_driving_score} />
                      <DataRow title="Weather Condition Score" value={sessionData.weather_condition_score} />
                      <DataRow title="Prolong Violations Score" value={sessionData.prolong_violations_score} />
                      <DataRow title="Total Risk Score" value={sessionData.risk_score} />
                    </View>
                  </View>
                ):(<></>)
              }
            </View>
        </ScrollView>
      {/* <FlatList
        // data={[{id: 1}, {id: 2}, {id: 3}, ]}
        // data={[]}
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({item}) => (
            <VideoCard video = {item}/>
        )}
        ListHeaderComponent={() => (
            <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoNewSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3">
                Latest Videos
              </Text>
                <Trending posts={latestPosts ?? []}/>
            </View>
        </View>
        )}
        ListEmptyComponent={() => (
            <EmptyState title="No Videos Found"
            subtitle="Be the first one to upload a video"
            />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      /> */}
    </SafeAreaView>
  )
}

export default Home