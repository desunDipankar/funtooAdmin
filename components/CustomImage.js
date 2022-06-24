import React, { useState } from 'react';
import { StyleSheet, Image, ImageProgressEventDataIOS ,Animated} from 'react-native';
import PropTypes from "prop-types";
import { View } from 'react-native';

export default function CustomImage(props) {
    const {
        source,
        style,
        ...rest
    } = props;

    const [progress, setProgress] = useState(0);
    const [complete, setcomplete] = useState(false);

    // const onStart = (event)=>{ for first imaga
    //     setcomplete(false)
    // }

    const onProgress = (event) => {
        setProgress(event.loaded)         
    }

    const onLoadEnd = () => {         
        setcomplete(true)
    }

    const tempImage = require('../assets/imageloader.gif');

    return (
        <View>
            {
                !complete && 
                <Image source={tempImage} style={style}/>
            }
        
        <Image source={source}
            //onLoadStart={onStart}
            onProgress={onProgress}
            onLoadEnd={onLoadEnd}
            onLoad={onLoadEnd}            
            style={complete?style:styles.NoShow}
            {...rest}
        />
        </View>        
    )
}


CustomImage.propTypes = {
    source: PropTypes.any.isRequired,
    style: PropTypes.any,
};


const styles = StyleSheet.create({
    NoShow: {
        display: "none",
        height:0,
        width:0
    }
}); 
