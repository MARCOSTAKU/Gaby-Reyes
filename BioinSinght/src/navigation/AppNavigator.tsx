import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AuthNavigator from "./AuthNavigator";

export default function AppNavigator(){

    return(

        <SafeAreaProvider>
            <NavigationContainer>
                <AuthNavigator/>
            </NavigationContainer>
        </SafeAreaProvider>

    )

}
