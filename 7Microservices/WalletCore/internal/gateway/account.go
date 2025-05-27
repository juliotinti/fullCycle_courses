package gateway

import "github.com/juliotinti/fullCycle_courses/internal/entity"

type AccountGateway interface {
	Save(account *entity.Account) error
	FindByID(id string) (*entity.Account, error)
}
