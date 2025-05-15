package gateway

import "github.com/juliotinti/fullCycle_courses/internal/entity"

type ClientGateway interface {
	Get(id string) (*entity.Client, error)
	Save(client *entity.Client) error
}
