export const calculateCartTotals = (items = []) => 
    items.reduce(
        (acc, item) => {
            const qty = Number(item?.quantity ?? 0);
            const price  = Number(item?.product?.price ?? item?.price ?? 0);
            if(Number.isFinite(qty) && Number.isFinite(price)){
                acc.itemsCount += qty;
                acc.subtotal += price * qty;
            }
            return acc;
        },
        { itemsCount: 0, subtotal:0 }
    );