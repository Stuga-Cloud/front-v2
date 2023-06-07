// This is the golang api structs

// // ApplicationScalabilitySpecifications is a struct that represents the scalability specifications of an application
// // swagger:model ApplicationScalabilitySpecifications
// type ApplicationScalabilitySpecifications struct {
//     MinimumInstanceCount int32 `json:"minimumInstanceCount" binding:"required"`
//     MaximumInstanceCount int32 `json:"maximumInstanceCount" binding:"required"`
//     Replicas             int32 `json:"replicas" binding:"required"`
//     IsAutoScaled         bool  `json:"isAutoScaled" binding:"boolean" gorm:"default:false"`
//     // If true, the application will be scaled automatically, otherwise, the user will have to scale it manually (he will be emailed -> TODO).
// }

export interface ContainerApplicationScalabilitySpecifications {
    replicas: number;
    isAutoScaled: boolean;
    cpuUsagePercentageThreshold: number;
    memoryUsagePercentageThreshold: number;
}
