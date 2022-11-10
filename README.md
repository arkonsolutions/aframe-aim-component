# aframe-aim-component
A-FRAME component that points entity behind the back by arrow at screen border

* Live example: https://aframe-aim-component.glitch.me/
* Try in Glitch: https://glitch.com/edit/#!/aframe-aim-component
# Concept #

 This component should help the user understand which way he needs to turn to see the target object, which is not currently on the screen.

![Concept scatch](images/concept.png "Concept scatch")

# Notes #

Please, do not forget to include css styles from file `./dist/main.css` to you project.

# Using #

```
<a-scene>
    <a-entity camera look-controls="pointerLockEnabled: true" wasd-controls position="0 0 0"></a-entity>
    <a-box aim="color: red" position="-10 0 5" color="red"></a-box>
    <a-box aim="color: blue" position="10 0 5" color="blue"></a-box>
    <a-box aim="color: green; glyph: ←" position="0 1 5" color="green"></a-box>
</a-scene>
```

## Parameters ##

| Name | Type | Default value |
|-|-|-|
| color | color | 'yellow' |
| glyph | string | '◄' |

# Participation #

There is a thread on the forum where work on this component and existing problems are discussed: 

https://stackoverflow.com/questions/74328030/draw-a-pointer-on-the-edge-of-the-screen-that-points-to-the-target-object-behind

You are welcome to improve this code.

# Links #
NPM: https://www.npmjs.com/package/aframe-aim-component