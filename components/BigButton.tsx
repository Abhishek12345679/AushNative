import { Text, Pressable, ActivityIndicator, View } from 'react-native'
import React from 'react'
import { colors } from '../constants/colors'

interface BigButtonProps {
    disabled?: boolean;
    text: string;
    subtitle?: string;
    onPress: () => void;
    loading?: boolean;
    buttonStyle?: {};
    titleStyle?: {}
    subtitleStyle?: {}
}

const BigButton = ({ text, onPress, loading, buttonStyle, disabled, subtitle, titleStyle, subtitleStyle }: BigButtonProps) => {
    return (
        <Pressable
            disabled={disabled}
            android_ripple={{
                color: "#fff",
                borderless: false
            }}
            onPress={onPress}
            style={{
                ...{
                    width: '100%',
                    height: 70,
                    backgroundColor: colors.SECONDARY,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginVertical: 15,
                    borderRadius: 10,
                },
                ...buttonStyle
            }}>
            {!loading ? (
                <View style={{ flexDirection: 'column-reverse' }}>
                    <Text
                        style={{
                            ...{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bold',
                                textAlign: 'center'

                            },
                            ...titleStyle
                        }
                        }
                    >
                        {text}
                    </Text>
                    {subtitle && <Text
                        style={{
                            ...{
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 'bold',
                                textAlign: 'center'
                            },
                            ...subtitleStyle
                        }}
                    >
                        {subtitle}
                    </Text>}
                </View>
            ) : (
                <ActivityIndicator size="small" color={titleStyle.color ? titleStyle.color : "#fff"} />
            )}
        </Pressable>
    )
}

export default BigButton