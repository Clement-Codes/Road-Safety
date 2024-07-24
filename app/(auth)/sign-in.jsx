import { View, Text, ScrollView, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link } from 'expo-router';
import { signIn } from '../../lib/appwrite';

const SignIn = () => {
    const [form, setForm] = useState({
        email: '',
        password: ''
    })

    const [isSubmitting, setIsSubmitting] = useState(false)

    const submit = async() => {
        if(!form.email || !form.password){
            Alert.alert('Error', 'Please fill in all the fields')
        }

        setIsSubmitting(true);

        try{
            await signIn(form.email, form.password);

            // set it to global state...

            router.replace('/home')

        } catch (error){

        } finally {
            setIsSubmitting(false)
        }
        
    }

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView>
            <View className='w-full justify-center h-full px-4 my-6 min-h-[83vh]'>
                <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]"/>
                <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Log in to Aora</Text>
                <FormField title="Email" value={form.email} handleChangeText={(e) => setForm({...form, email: e})} otherStyles="mt-5" keyboardType="email-address"/>
                <FormField title="Password" value={form.password} handleChangeText={(e) => setForm({...form, password: e})} otherStyles="mt-5"/>
                <CustomButton title="Sign In" handlePress={submit} containerStyles="mt-7" isLoading={isSubmitting}/>
                <View className="justify-center pt-5 flex-row gap-2">
                    <Text className="text-lg text-gray-100 font-pregular">
                        Don't have account?{' '}
                        <Link href='/sign-up' className='text-lg font-psemibold text-secondary'>Sign Up</Link>
                    </Text>
                </View>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn