const validTransitions = {
    Pending : ["Ready"],
    Ready : ["Running"],
    Running : ["Completed", "Failed"],
    Completed : [],
    Failed : []
};

export const canTransition = (current, next) => {
    return validTransitions[current]?.includes(next);
};