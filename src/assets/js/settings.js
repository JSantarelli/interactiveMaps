/**
 * ANIMATIONS
 */

// based on a function

const clock = new THREE.Clock()

const tick = () =>
{

    targetX = mouseX * .001
    targetY = mouseY * .001

    // Render
    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()