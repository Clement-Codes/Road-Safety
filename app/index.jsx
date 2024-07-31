import { Image, ScrollView, Text, View } from 'react-native'
import React from 'react'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaView } from 'react-native-safe-area-context'
import { images } from '../constants'
import CustomButton from '../components/CustomButton'

import {useGlobalContext} from '../context/GlobalProvider'

export default RootLayout = () => {
    const {isLoading, isLoggedIn} = useGlobalContext();
    if(!isLoading && isLoggedIn) return <Redirect href="/home"/>
    
  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView contentContainerStyle={{height: '100%'}}>
            <View className="w-full justify-center items-center h-full px-4">
                <Image source={images.logoNew} className="max-w-[380px] w-full h-[300px]" resizeMode='contain'/>
                <View className="relative mt-5">
                    <Text className="text-3xl text-white font-bold text-center">Know Your Risk, Improve Your{' '}<Text className="text-[#7868d8]">Drive</Text></Text>
                    <Image className="w-[136px] h-[15px] absolute -bottom-2 -right-8" source={images.path} resizeMode='contain'/>
                </View>
                {/* <Image source={images.logo} className="w-[130px] h-[84px]" resizeMode='contain'/> */}
                {/* <Image source={images.cards} className="max-w-[380px] w-full h-[300px]" resizeMode='contain'/> */}
                {/* <View className="relative mt-5">
                    <Text className="text-3xl text-white font-bold text-center">Discover Endless Possibilities with {' '}<Text className="text-secondary-200">Aora</Text></Text>
                    <Image className="w-[136px] h-[15px] absolute -bottom-2 -right-8" source={images.path} resizeMode='contain'/>
                </View> */}
                <Text className="text-sm font-pregular text-gray-100 mt-7 text-center" >Become a safer driver with DriveSafe by monitoring your speed, acceleration, and braking.</Text>
                <CustomButton title="Continue with Email" handlePress={()=>{router.push('/sign-in')}} containerStyles="w-full m-7"/>
            </View>
        </ScrollView>
        <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
    // <View className="flex-1 items-center justify-center bg-white">
    //   <Text className="text-3xl font-pblack">RootLayouts</Text>
    //   <StatusBar style='auto'/>
    //   <Link href="/home" style={{color: 'blue'}}>Go to Home</Link>
    // </View>
  )
}


// const styles = StyleSheet.create({
//     container:{
//         display:'flex',
//         flex:1,
//         alignItems:'center',
//         justifyContent:'center'
//     }
// })