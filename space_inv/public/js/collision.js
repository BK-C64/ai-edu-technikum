/**
 * Moduł detekcji kolizji AABB (Axis-Aligned Bounding Box)
 */

/**
 * Sprawdza, czy dwa prostokąty (boxy) zachodzą na siebie.
 * @param {Object} boxA Obiekt posiadający x, y, width, height
 * @param {Object} boxB Obiekt posiadający x, y, width, height
 * @returns {boolean} true jeśli nastąpiła kolizja
 */
export function checkAABB(boxA, boxB) {
    return (
        boxA.x < boxB.x + boxB.width &&
        boxA.x + boxA.width > boxB.x &&
        boxA.y < boxB.y + boxB.height &&
        boxA.y + boxA.height > boxB.y
    );
}
