using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;
using SoundTrack.Dtos;
using SoundTrack.Models;

namespace SoundTrack.App_Start
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<User, UserDto>();
            CreateMap<UserDto,User>();
        }
    }
}